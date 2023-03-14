<div
    id="<?= $this->getId() ?>"
    data-control="wm-ymap"
    data-mode="<?= $this->mode ?>"
    data-is-preview="<?= (int)$this->previewMode ?>"
    data-use-placemark="<?= (int)$this->usePlacemark ?>"
    <?= $this->getFieldMapAttributes() ?>
>
    <input
        id="<?= $this->getId('input') ?>"
        class="form-control"
        type="hidden"
        name="<?= $name ?>"
        value="<?= e($value ? (is_array($value) ? json_encode($value) : $value) : '{}') ?>"
        autocomplete="off"
        data-wm-ymap-input
        <?php if ($this->previewMode) : ?>disabled="disabled"<?php endif; ?>
    />

    <div
        id="<?= $this->getId('map') ?>"
        class="wm-ymap"
        style="height: <?= $mapHeight ?>px"
        data-wm-ymap-map
    ></div>
</div>
