<?php

return [
    'plugin' => [
        'name' => 'Виджеты форм',
        'description' => 'Виджеты и поля для форм',
    ],
    'permissions' => [
        'settings_access' => 'Доступ к настройкам',
    ],
    'models' => [
        'settings' => [
            'label' => 'Виджеты форм',
            'description' => 'Настройки виджетов и полей форм',
            'tabs' => [
                'maps' => 'Карты',
            ],
            'fields' => [
                'ymaps_api_key' => [
                    'label' => '[Яндекс.Карты] Ключ API',
                    'placeholder' => 'Ключ для API Яндекс.Карт',
                ],
                'ymaps_api_lang' => [
                    'label' => '[Яндекс.Карты] Локаль',
                ],
            ],
        ],
    ],
];
