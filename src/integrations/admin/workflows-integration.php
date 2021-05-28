<?php

namespace Yoast\WP\SEO\Premium\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WorkflowsIntegration class
 */
class Workflows_Integration implements Integration_Interface {

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
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
			__( 'Workflows', 'wordpress-seo-premium' ),
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
	}

	/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		echo '<div id="wpseo-workflows-container"></div>';
	}
}
