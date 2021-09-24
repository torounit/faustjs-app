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
        'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt','revisions')
    ]);

    register_taxonomy( 'genre', 'book', [
        'labels'  => [
            'menu_name' => __( 'Genres', 'your-textdomain' ), //@see https://developer.wordpress.org/themes/functionality/internationalization/
        ],
        'show_in_graphql' => true,
        'public' => true,
        'show_in_rest' => true,
        'show_in_quick_edit' => true,
        'graphql_single_name' => 'genre',
        'graphql_plural_name' => 'genres',
    ]);
});

add_filter('preview_post_link', function ($link, WP_Post $post) {
    if (in_array($post->post_type, array('post', 'page', 'attachment'))) {
        return $link;
    }
    return add_query_arg('post_type', $post->post_type, $link);
}, 10, 2);
