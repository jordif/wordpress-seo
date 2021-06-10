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
	 *
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
		$asset_manager->localize_script(
			'workflows',
			'wpseoWorkflowsData',
			[
				'cornerstones'     => $this->indexable_repository->query()
					->select_many( [ 'id', 'permalink', 'breadcrumb_title', 'is_cornerstone', 'object_sub_type', 'incoming_link_count' ] )
					->where( 'is_cornerstone', true )
					->find_array(),
				'mostLinks'        => $this->indexable_repository->query()
					->where_raw( 'object_sub_type NOT IN ( "attachment" ) OR post_status IS NULL' )
					->where_raw( 'post_status NOT IN ( "draft", "auto-draft" ) OR post_status IS NULL' )
					->where_in( 'object_type', [ 'term', 'post' ] )
					->order_by_desc( 'incoming_link_count' )
					->limit( 20 )
					->find_array(),
				'cornerstoneGuide' => 'https://yoast.com/how-to-set-up-a-cornerstone-content-strategy-with-yoast-seo/',
			]
		);
		$asset_manager->enqueue_style( 'monorepo' );
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

			.workflow tr.cornerstone {
				font-weight: 800;
			}
			#wpseo-workflows-container div.card {
				max-width: 600px;
				width: 100%;
				padding: 24px;
				border-radius: 8px;
				box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
				border: 0;
			}
			.workflow {
				list-style: none;
				counter-reset: line-number;
				margin-left:48px;
			}
			.workflow li {
				position: relative;
				counter-increment: line-number;
				padding-bottom: 16px;
			}
			.workflow > li::before {
				content: "";
				position: absolute;
				width: 2px;
				background: #a4286a;
				left: -33px;
				top: 0;
				bottom: -20px;
			}
			.workflow > li:last-of-type::before {
				display: none;
			}
			.workflow > li::after {
				content: counter(line-number);
				width: 28px;
				height: 28px;
				text-align: center;
				border: solid 2px #a4286a;
				color: #a4286a;
				background: #fff;
				position: absolute;
				display:block;
				border-radius: 100%;
				line-height: 28px;
				top:-8px;
				left: -48px;
			}
			.workflow li.finished::after {
				content: "";
				background: url("data:image/svg+xml,<svg width='24' fill='none' stroke='%23FFFFFF' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' role='img' aria-hidden='true' focusable='false'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'></path></svg>") #a4286a;
				background-size: 20px 20px;
				background-position: center center;
			}

			.workflow li img {
				max-width: 100%;
			}

			.workflow li img.workflow__image{
				max-height: 100px;
				max-width: 100px;
			}

			.workflow__grid {
				display: grid;
				grid-template-columns: auto 100px;
				gap: 8px;
			}

			.workflow__grid > div:last-of-type {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;
			}

		</style>
		<?php
		echo '<div id="wpseo-workflows-container"></div>';
	}
}
