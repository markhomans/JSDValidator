# [JSDValidator](http://www.jsdvalidator.com/)

*Does for JavaScript what XSD does for XML*

JSD stands for Javascript Schema Definition. It defines how a javascript object/variable should be formed. The JSD Validator takes a Javascript object and tests if it's valid according to the schema. It is basically a dimmed down version of what XSD does for XML.

To get started, check out http://www.jsdvalidator.com!

## Quick start

* Download JSDValidator from the [download-page](http://build-software.nl/JSDValidator/download)
  + Or Clone a repo: `git clone git://github.com/markhomans/JSDValidator.git`.
* Place it somewhere in your project and include it in the pages where you want to use it:
```<script src="JSDValidator-1.4.js"></script>```
* Create a schema to validate with. See [JSD Schema page](http://build-software.nl/JSDValidator/JSDSchema) for more info.
  + Or generate a schema with the [online JSD Generator](http://build-software.nl/JSDValidator/JSDGenerator)
* Create a Javascript object to validate
* Create a validator instance and validate your object. See [JSD Validator page](http://build-software.nl/JSDValidator/validator) for more info

## Quick example

```
//define the schema to validate with
var jsd_schema =
{
    Type: "Object",
    Attributes: [
    {
      Name: "Name",
      Type: "String"
    },
    {
      Name: "Age",
      Type: "Number"
    },
    {
      Name: "Gender",
      Type: "String",
      Values: [
        "M",
        "F"
      ]
    }
  ]
};
 
//define the object to validate
var me =
{
    Name: "Mark",
    Age: 30,
    Gender: "M"
};
 
//instanciate a JSD Validator and set it's schema to the one we created
var jsd_validator = new JSDValidator({Schema: jsd_schema});
 
//test if the object we created is valid
if(jsd_validator.Validate(me))
{
    //our object is valid!
    console.log('Valid!');
}
else
{
    //our object is not valid :(
    console.log(jsd_validator.Error);
}
```

## Contribute?
If you wish to contribute, request features or just ask anything, send me an email: mark@build-software.nl

## Copyright and license
Copyright 2013 Build-Software

Licensed under the FreeBSD License.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE FREEBSD PROJECT ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE FREEBSD PROJECT OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the authors and should not be interpreted as representing official policies, either expressed or implied, of the FreeBSD Project.