# iep-printing

iep-printing is a custom plugin for PowerSchool that works with [iep-printing-php](https://github.com/IronCountySchoolDistrict/iep-printing-php) to bring an IEP solution to PowerSchool. Track IEPs for students and Print [FormBuilder](http://www.accelaschool.com/formbuilder) forms.

## Setup

Clone or download this repository to someplace on your machine.  
Rename `example.config.json` to `config.json`.  
Open `config.json` in your favorite editor.

Change the value for `api_url` to match the url to your very own [iep-printing-php](https://github.com/IronCountySchoolDistrict/iep-printing-php). *It is important that there is a trailing slash at the end of the url*.

## Installation

You need to package everything yourself. Here is the recommended way of doing that.

Make sure you have [nodejs](https://nodejs.org/en/download/) installed.

- In the command line, navigate to the root of the repository.
- Run `npm install -g gulp`
- Run `npm install`
- Run `gulp build && gulp package`

The last command will create a `dist/` directory. Inside will be a file named `plugin.zip`. This is the file that contains the whole of the plugin that you can use to install the plugin into PowerSchool. Note that this will have packaged the plugin with the `api_url` specified in your `config.json` file. If you got it wrong or the url changed, you'll need to rerun `gulp build && gulp package` and reinstall the plugin in PowerSchool.
