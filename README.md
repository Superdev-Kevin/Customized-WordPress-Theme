# Flynt

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Build Status](https://travis-ci.org/flyntwp/flynt-starter-theme.svg?branch=master)](https://travis-ci.org/flyntwp/flynt-starter-theme)
[![Code Quality](https://img.shields.io/scrutinizer/g/flyntwp/flynt-starter-theme.svg)](https://scrutinizer-ci.com/g/flyntwp/flynt-starter-theme/?branch=master)

## Short Description
[Flynt](https://flyntwp.com/) is a WordPress theme for component-based development using [Timber](#page-templates) and [Advanced Custom Fields](#advanced-custom-fields).

## Table of Contents
* [Install](#install)
  * [Dependencies](#dependencies)
* [Usage](#usage)
  * [Assets](#assets)
  * [Lib & Inc](#lib--inc)
  * [Page Templates](#page-templates)
  * [Components](#components)
  * [Advanced Custom Fields](#advanced-custom-fields)
  * [Field Groups](#field-groups)
  * [ACF Option Pages](#acf-option-pages)
  * [WPML](#wpml)
* [Maintainers](#maintainers)
* [Contributing](#contributing)
* [License](#license)

## Install
1. Clone this repo to `<your-project>/wp-content/themes`.
2. Change the host variable in `flynt/build-config.js` to match your host URL: `const host = 'your-project.test'`
3. Navigate to the theme folder and run the following command in your terminal:
```
# wp-content/themes/flynt
composer install
npm i
npm run build
```
4. Open the WordPress back-end and activate the Flynt theme.
5. Run `npm run start` and start developing. Your local server is available at `localhost:3000`.

### Dependencies
* [WordPress](https://wordpress.org/) >= 5.0
* [Node](https://nodejs.org/en/) = 12
* [Composer](https://getcomposer.org/download/) >= 1.8
* [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/) >= 5.7

## Usage
In your terminal, navigate to `<your-project>/wp-content/themes/flynt` and run `npm start`. This will start a local server at `localhost:3000`.

All files in `assets` and `Components` will now be watched for changes and compiled to the `dist` folder. Happy coding!

Flynt comes with a ready to use Base Style built according to our best practices for building simple, maintainable components. Go to `localhost:3000/BaseStyle` to see it in action.

### Assets

The `./assets` folder contains all global JavaScript, SCSS, images, and font files for the theme. Files inside this folder are watched for changes and compile to `./dist`.

The `main.scss` file is compiled to `./dist/assets/main.css` which is enqueued in the front-end.

The `admin.scss` file is compiled to `./dist/assets/admin.css` which is enqueued in the administrator back-end of WordPress, so styles added to this file will take effect only in the back-end.

### Lib & Inc

The `./lib` folder includes helper functions and basic setup logic. *You will most likely not need to modify any files inside `./lib`.* All files in the `./lib` folder are autoloaded via PSR-4.

The `./inc` folder is a more organised version of WordPress' `functions.php` and contains all custom theme logic. All files in the `./inc` folder are automatically required.

For organisation, `./inc` has three subfolders. We recommend using these three folders to keep the theme well-structured:

- `customPostTypes`<br> Use this folder to register custom WordPress post types.
- `customTaxonomies`<br> Use this folder to register custom WordPress taxonomies.
- `fieldGroups`<br> Use this folder to register Advanced Custom Fields field groups. (See [Field Groups](#field-groups) for more information.)

After the files from `./lib` and `./inc` are loaded, all [components](#components) from the `./Components` folder are loaded.

### Page Templates
Flynt uses [Timber](https://www.upstatement.com/timber/) to structure its page templates and [Twig](https://twig.symfony.com/) for rendering them. [Timber's documentation](https://timber.github.io/docs/) is extensive and up to date, so be sure to get familiar with it.

There are two Twig functions added in Flynt to render components into templates:
* `renderComponent(componentName, data)` renders a single component. [For example, in the `index.twig` template](https://github.com/flyntwp/flynt/tree/master/templates/index.twig).
* `renderFlexibleContent(flexibleContentField)` renders all components passed from an Advanced Custom Fields *Flexible Content* field. [For example, in the `single.twig` template.](https://github.com/flyntwp/flynt/tree/master/templates/single.twig)

Besides the main document structure (in `./templates/_document.twig`), everything else is a component.

### Components
A component is a self-contained building-block. Each component contains its own layout, its ACF fields, PHP logic, scripts, and styles.

```
  ExampleComponent/
  ├── functions.php
  ├── index.twig
  ├── README.md
  ├── screenshot.png
  ├── script.js
  ├── style.scss
```

The `functions.php` file for every component in the `./Components` folder is executed during the WordPress action `after_setup_theme`. [This is run from the `./functions.php` file of the theme.](https://github.com/flyntwp/flynt/tree/master/functions.php)

To render components into a template, see [Page Templates](#page-templates).

### Advanced Custom Fields
To define Advanced Custom Fields (ACF) for a component, use `Flynt\Api\registerFields`. This has 3 arguments:

```php
Flynt\Api\registerFields($scope = 'ComponentName', $fields = [], $fieldId = null);
```

`$scope` is the name of the component, `$fields` are the ACF fields you want to register, and `$fieldsId` is an optional (rarely needed) parameter for registering multiple fields for a single scope.

For example:

```php
use Flynt\Api;

Api::registerFields('BlockWysiwyg', [
    'layout' => [
        'name' => 'blockWysiwyg',
        'label' => 'Block: Wysiwyg',
        'sub_fields' => [
            [
                'name' => 'contentHtml',
                'label' => 'Content',
                'type' => 'wysiwyg',
                'required' => 1,
            ]
        ]
    ]
]);
```

In the example above, the `layout` array is required in order to load this component into an Advanced Custom Fields *Flexible Content* field.

### Field Groups
Field groups are needed to show registered fields in the WordPress back-end. All field groups are created in the `./inc/fieldGroups` folder. Two field groups exist by default: [`pageComponents.php`](https://github.com/flyntwp/flynt/tree/master/inc/templates/pageComponents.php) and [`postComponents.php`](https://github.com/flyntwp/flynt/tree/master/inc/templates/postComponents.php).

To include fields that have been registered with `Flynt\Api::registerFields`, use `ACFComposer::registerFieldGroup($config)` inside the `Flynt/afterRegisterComponents` action.

Use `Flynt\Api::loadFields($scope, $fieldPath = null)` to load groups of fields into a field group. For example:

```php
use ACFComposer\ACFComposer;
use Flynt\Api;

add_action('Flynt/afterRegisterComponents', function () {
    ACFComposer::registerFieldGroup([
        'name' => 'pageComponents',
        'title' => 'Page Components',
        'style' => 'seamless',
        'fields' => [
            [
                'name' => 'pageComponents',
                'label' => 'Page Components',
                'type' => 'flexible_content',
                'button_label' => 'Add Component',
                'layouts' => [
                    Api::loadFields('BlockWysiwyg', 'layout'),
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ],
            ],
        ],
    ]);
});
```

More information on field groups can be found in the [ACF Field Group Composer repository](https://github.com/flyntwp/acf-field-group-composer).

### ACF Option Pages
Flynt includes several utility functions for creating Advanced Custom Fields options pages. Briefly, these are:

* `Flynt\Utils\Options::addTranslatable`<br> Adds fields into a new group inside the Translatable Options options page. When used with the WPML plugin, these fields will be returned in the current language.
* `Flynt\Utils\Options::addGlobal`<br> Adds fields into a new group inside the Global Options options page. When used with WPML, these fields will always be returned from the primary language. In this way these fields are *global* and cannot be translated.
* `Flynt\Utils\Options::get` <br> Used to retrieve options from Translatable or Global options.

## Maintainers
This project is maintained by [bleech](https://github.com/bleech).

The main people in charge of this repo are:
* [Steffen Bewersdorff](https://github.com/steffenbew)
* [Dominik Tränklein](https://github.com/domtra)
* [Doğa Gürdal](https://github.com/Qakulukiam)
* [Michael Carruthers](https://github.com/emcarru)

## Contributing
To contribute, please use GitHub [issues](https://github.com/flyntwp/flynt/issues). Pull requests are accepted. Please also take a moment to read the [Contributing Guidelines](https://github.com/flyntwp/guidelines/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/flyntwp/guidelines/blob/master/CODE_OF_CONDUCT.md).

If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License
MIT © [bleech](https://www.bleech.de)
