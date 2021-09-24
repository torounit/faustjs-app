<?php

add_action( 'init', function() {
	register_post_type( 'book', [
		'show_ui' => true,
		'labels'  => [
			//@see https://developer.wordpress.org/themes/functionality/internationalization/
			'menu_name' => __( 'Books', 'your-textdomain' ),
		],
		'has_archive' => true,
		'show_in_graphql' => true,
		'hierarchical' => false,
		'graphql_single_name' => 'book',
		'graphql_plural_name' => 'books',
	] );
} );
