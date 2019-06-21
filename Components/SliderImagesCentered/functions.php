<?php

namespace Flynt\Components\SliderImagesCentered;

use Flynt\Api;
use Flynt\Utils\Options;

add_filter('Flynt/addComponentData?name=SliderImagesCentered', function ($data) {
    $data['jsonData'] = [
        'sliderOptions' => Options::get('translatableOptions', 'feature', 'SliderOptions'),
    ];

    return $data;
});

Api::registerFields('SliderImagesCentered', [
    'layout' => [
        'name' => 'sliderImagesCentered',
        'label' => 'Slider: Images Centered',
        'sub_fields' => [
            [
                'label' => 'General',
                'name' => 'generalTab',
                'type' => 'tab',
                'placement' => 'top',
                'endpoint' => 0
            ],
            [
                'label' => 'Title',
                'name' => 'preContentHtml',
                'type' => 'wysiwyg',
                'media_upload' => 0,
                'toolbar' => 'full',
                'wrapper' => [
                    'class' => 'autosize',
                ],
            ],
            [
                'label' => 'Images',
                'instructions' => '',
                'name' => 'images',
                'type' => 'gallery',
                'min' => 1,
                'preview_size' => 'medium',
                'library' => 'all',
                'min_width' => 0,
                'min_height' => 0,
                'max_size' => 2.5,
                'mime_types' => 'jpg,jpeg',
                'required' => 1,
            ],
            [
                'label' => 'Options',
                'name' => 'optionsTab',
                'type' => 'tab',
                'placement' => 'top',
                'endpoint' => 0
            ],
            [
                'label' => '',
                'name' => 'options',
                'type' => 'group',
                'layout' => 'row',
                'sub_fields' => [
                    [
                        'label' => 'Enable Autoplay',
                        'name' => 'autoplay',
                        'type' => 'true_false',
                        'default_value' => 0,
                        'ui' => 1
                    ],
                    [
                        'label' => 'Autoplay Speed',
                        'name' => 'autoplaySpeed',
                        'type' => 'number',
                        'min' => 2000,
                        'step' => 1,
                        'conditional_logic' => [
                            [
                                [
                                    'fieldPath' => 'autoplay',
                                    'operator' => '==',
                                    'value' => 1
                                ]
                            ]
                        ],
                    ],
                ],
            ],
        ]
    ]
]);
