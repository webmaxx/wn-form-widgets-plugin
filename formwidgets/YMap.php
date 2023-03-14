<?php namespace Webmaxx\FormWidgets\FormWidgets;

use Html;
use Backend\Classes\FormWidgetBase;
use Webmaxx\FormWidgets\Models\Settings;

/**
 * YMap Form Widget
 */
class YMap extends FormWidgetBase
{
    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'webmaxx_formwidgets_ymap';

    public $mode = 'json'; // 'json' or 'fields'

    /**
     * Array [type => fieldName]
     *
     * Allow types:
     *  - center
     *  - center_latitude
     *  - center_longitude
     *  - zoom
     *  - placemark
     *  - placemark_latitude
     *  - placemark_longitude
     *
     * @var array
     */
    public $fieldMap = [];

    public $usePlacemark = false;

    public $mapHeight = 300;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'fieldMap',
            'usePlacemark',
            'mapHeight',
        ]);
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('ymap');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['model'] = $this->model;
        $this->vars['mode'] = $this->mode;
        $this->vars['usePlacemark'] = $this->usePlacemark;
        $this->vars['mapHeight'] = $this->mapHeight;
    }

    public function getFieldMapAttributes()
    {
        $formFields = $this->getParentForm()->getFields();
        $formMapFields = [];

        foreach ($this->fieldMap as $mapFieldName => $fieldName) {
            if (!$field = array_get($formFields, $fieldName)) {
                continue;
            }

            $formMapFields['data-field-'.$mapFieldName] = '#'.$field->getId();
        }

        return Html::attributes($formMapFields);
    }

    /**
     * @inheritDoc
     */
    public function loadAssets()
    {
        $apiKey = Settings::get('ymaps_api_key');
        $lang = Settings::get('ymaps_api_lang', 'ru_RU');
        $this->addCss('css/ymap.css', 'Webmaxx.FormWidgets');
        $this->addJs("//api-maps.yandex.ru/2.1/?apikey={$apiKey}&lang={$lang}");
        $this->addJs('js/ymap.js');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return $value ?: '{}';
    }
}
