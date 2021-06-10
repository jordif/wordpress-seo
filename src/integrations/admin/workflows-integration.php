<?php

namespace Yoast\WP\SEO\Premium\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * WorkflowsIntegration class
 */
class Workflows_Integration implements Integration_Interface {
	/**
	 * @var Indexable_Repository The indexable repository.
	 */
	private $indexable_repository;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Workflows_Integration constructor.
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 9 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Adds the workflows submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array the filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		$submenu_pages[4] = [
			'wpseo_dashboard',
			'',
			__( 'Workouts', 'wordpress-seo-premium' ),
			'edit_posts',
			'wpseo_workflows',
			[ $this, 'render_target' ],
		];

		return $submenu_pages;
	}

	/**
	 * Enqueue the workflows app.
	 */
	public function enqueue_assets() {
		$asset_manager = new \WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'workflows' );
		$asset_manager->localize_script( 'workflows', 'wpseoWorkflowsData', [
			'cornerstones' => $this->indexable_repository->query()
				->select_many( [ "id", "permalink", "breadcrumb_title", "is_cornerstone", "object_sub_type", "incoming_link_count" ] )
				->where( 'is_cornerstone', true )
				->find_array(),
			'mostLinks' => $this->indexable_repository->query()
				->where_raw( 'object_sub_type NOT IN ( "attachment" ) OR post_status IS NULL' )
				->where_raw( 'post_status NOT IN ( "draft", "auto-draft" ) OR post_status IS NULL' )
				->where_in( "object_type", ["term", "post"] )
				->order_by_desc( 'incoming_link_count' )
				->limit(20)
				->find_array(),
			'cornerstoneGuide' => 'https://yoast.com/how-to-set-up-a-cornerstone-content-strategy-with-yoast-seo/',
		] );
	}

	/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		?>
		<style>
			#wpseo-workflows-container h1,
			#wpseo-workflows-container h3 {
				color: #a4286a;
				font-weight: 500;
			}
			#wpseo-workflows-container h2 {
				font-size: 12px;
				text-transform: uppercase;
			}
			li.finished {
				text-decoration: line-through;
			}
			tr.cornerstone {
				font-weight: 800;
			}
			div.card {
				max-width: 600px;
				padding: 16px;
			}
		</style>
		<?php
		echo '<div id="wpseo-workflows-container"></div>';
	}
}
