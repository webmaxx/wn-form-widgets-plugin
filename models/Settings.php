<?php namespace Webmaxx\FormWidgets\Models;

use Model;

/**
 * Settings Model
 */
class Settings extends Model
{
    use \Winter\Storm\Database\Traits\Validation;

    /**
     * @var array Behaviors implemented by this model.
     */
    public $implement = [\System\Behaviors\SettingsModel::class];

    /**
     * @var string Unique code
     */
    public $settingsCode = 'webmaxx_formwidgets_settings';

    /**
     * @var mixed Settings form field definitions
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var array Validation rules
     */
    public $rules = [];
}
