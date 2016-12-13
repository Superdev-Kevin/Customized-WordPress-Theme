<?php

namespace Flynt\Config;

define(__NAMESPACE__ . '\TEMPLATE_PATH', get_template_directory());
define(__NAMESPACE__ . '\MODULE_PATH_RELATIVE', '/dist/Modules/');
define(__NAMESPACE__ . '\MODULE_PATH', TEMPLATE_PATH . MODULE_PATH_RELATIVE);
define(__NAMESPACE__ . '\CONFIG_PATH_RELATIVE', '/config/');
define(__NAMESPACE__ . '\CONFIG_PATH', TEMPLATE_PATH . CONFIG_PATH_RELATIVE);
define(__NAMESPACE__ . '\CUSTOM_POST_TYPE_PATH_RELATIVE', CONFIG_PATH_RELATIVE . 'customPostTypes/');
define(__NAMESPACE__ . '\CUSTOM_POST_TYPE_PATH', TEMPLATE_PATH . CUSTOM_POST_TYPE_PATH_RELATIVE);
