<?php
/**
 * Plugin Name: config
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * @param mixed $value The setting value.
 * @param string $name The setting name.
 * @param mixed $default Optional setting value.
 */
add_filter('wpe_headless_get_setting', function ($value, $name) {
    if ('secret_key' === $name && defined('WP_HEADLESS_SECRET')) {
        return WP_HEADLESS_SECRET;
    }

    if ('frontend_uri' === $name && defined('FRONTEND_URI')) {
        return FRONTEND_URI;
    }

    return $value;
}, 10, 2);

add_filter('option_graphql_general_settings', function ($settings) {

    if (!$settings) {
        $settings = array(
            'graphql_endpoint' => 'graphql',
            'restrict_endpoint_to_logged_in_users' => 'off',
            'batch_queries_enabled' => 'on',
            'batch_limit' => '10',
            'query_depth_enabled' => 'off',
            'query_depth_max' => '10',
            'graphiql_enabled' => 'on',
            'show_graphiql_link_in_admin_bar' => 'on',
            'delete_data_on_deactivate' => 'on',
            'debug_mode_enabled' => 'off',
            'tracing_enabled' => 'off',
            'tracing_user_role' => 'administrator',
            'query_logs_enabled' => 'off',
            'query_log_user_role' => 'administrator',
            'public_introspection_enabled' => 'on',
        );
    }
    $settings['public_introspection_enabled'] = 'on';
    return $settings;
});


add_filter('pre_option_permalink_structure', function ($value) {
    if (defined('PERMALINK_STRUCTURE')) {
        return PERMALINK_STRUCTURE;
    }

    return $value;
});
