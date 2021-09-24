<?php

add_action('init', function () {
    register_post_type('book', [
        'show_ui' => true,
        'public' => true,
        'show_in_rest' => true,
        'labels' => [
            //@see https://developer.wordpress.org/themes/functionality/internationalization/
            'menu_name' => __('Books', 'your-textdomain'),
        ],
        'has_archive' => true,
        'rewrite' => array('with_front' => false, 'slug' => 'books'),
        'show_in_graphql' => true,
        'hierarchical' => false,
        'graphql_single_name' => 'book',
        'graphql_plural_name' => 'books',
        'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt')
    ]);
});
