<?php

return [
    'plugin' => [
        'name' => 'Form widgets',
        'description' => 'Widgets and fields for forms',
    ],
    'permissions' => [
        'settings_access' => 'Manage settings',
    ],
    'models' => [
        'settings' => [
            'label' => 'Form widgets',
            'description' => 'Settings for widgets and fields for forms',
            'tabs' => [
                'maps' => 'Maps',
            ],
            'fields' => [
                'ymaps_api_key' => [
                    'label' => '[Yandex.Maps] API key',
                    'placeholder' => 'API key for Yandex.Maps',
                ],
                'ymaps_api_lang' => [
                    'label' => '[Yandex.Maps] Language',
                ],
            ],
        ],
    ],
];
