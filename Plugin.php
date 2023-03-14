<?php namespace Webmaxx\FormWidgets;

use Backend;
use Backend\Models\UserRole;
use System\Classes\PluginBase;
use System\Classes\SettingsManager;

/**
 * FormWidgets Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     */
    public function pluginDetails(): array
    {
        return [
            'name'        => 'webmaxx.formwidgets::lang.plugin.name',
            'description' => 'webmaxx.formwidgets::lang.plugin.description',
            'author'      => 'Webmaxx',
            'icon'        => 'icon-list-alt',
        ];
    }

    /**
     * Registers any backend permissions used by this plugin.
     */
    public function registerPermissions(): array
    {
        return [
            'webmaxx.formwidgets.settings_access' => [
                'tab'   => 'webmaxx.formwidgets::lang.plugin.name',
                'label' => 'webmaxx.formwidgets::lang.permissions.settings_access',
                'roles' => [UserRole::CODE_DEVELOPER, UserRole::CODE_PUBLISHER],
            ],
        ];
    }

    /**
     * Registers backend settings for this plugin.
     */
    public function registerSettings(): array
    {
        return [
            'formwidgets' => [
                'category'    => SettingsManager::CATEGORY_BACKEND,
                'class'       => 'Webmaxx\FormWidgets\Models\Settings',
                'label'       => 'webmaxx.formwidgets::lang.models.settings.label',
                'description' => 'webmaxx.formwidgets::lang.models.settings.description',
                'icon'        => 'icon-list-alt',
                'permissions' => ['webmaxx.formwidgets.settings_access'],
            ]
        ];
    }

    public function registerFormWidgets()
    {
        return [
            'Webmaxx\FormWidgets\FormWidgets\YMap' => 'wm-ymap',
        ];
    }
}
