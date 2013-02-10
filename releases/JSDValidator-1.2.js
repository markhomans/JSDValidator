/*!
 * JSD Validator v1.2
 * http://www.build-software.nl/JSDValidator/
 *
 * Copyright 2013 Build-Software
 * Released under the FreeBSD license
 * http://www.freebsd.org/copyright/freebsd-license.html
 *
 * Date: 2013-01-25
 */

function JSDValidator(options)
{
    this.Error = null;
    
    this.SetSchema = function(jsd_schema)
    {
        main_schema = jsd_schema;
    };
    this.Validate = function(obj)
    {
        if(typeof JSON !== 'object')
            return returnFalse('JSON is undefined. Did you forget to include json2.js?');
            
        if(!valid_schema)
            return returnFalse(_this.Error);
        _this.Error = null;
        
        return test(obj, main_schema);
    };
    this.ValidateSchema = function(jsd_schema)
    {
        valid_schema = false;

        if(jsd_schema == undefined)
            jsd_schema = main_schema;
        
        if(jsd_schema == undefined)
            return returnFalse("No JSD Schema defined");
            
        _this.Error = null;
        valid_schema = testSchema(jsd_schema);
        return valid_schema;
            
    };
    var test = function(obj, schema, parent_obj)
    {
        //if no schema provided, use the main schema
        if(schema == undefined)
            schema = main_schema;
        
        //if we still have no schema, return false
        if(schema == undefined)
            return returnFalse("No JSD Schema defined");
        
        var defined = obj !== undefined;
        
        //if condition defined
        if(schema.Condition instanceof Function)
        {
            if(defined)
            {
                //we have it, so we need to check conditional
                if(!schema.Condition(obj, parent_obj))
                    return returnFalse("Condition did not get met on object ['"+JSON.stringify(obj,undefined, 2)+"']");
            }
            //we don't have the attribute. But if we Do pass the condition, we'll need to check optional
            else if(schema.Condition(obj, parent_obj) && !schema.Optional)
                return returnFalse("Object not found while not optional ['"+JSON.stringify(obj,undefined, 2)+"']");
        }
        else
        {
            //if the option is not optional, and we don't have the option: false
            if(!schema.Optional && !defined)
                return returnFalse("Object not found while not optional ['"+JSON.stringify(obj,undefined, 2)+"']");
        }
        //only continue validating if defined
        if(defined)
        {
            //check null
            if(obj==null)
            {
                if(!schema.CanBeNull)
                    return returnFalse("Object can't be null ["+JSON.stringify(obj, undefined,2)+"]");
                return true;
            }
            //check type
            if(schema.Type)
            {
                switch(schema.Type)
                {
                    case "String":
                        return testString(obj, schema);
                    case "Number":
                        return testNumber(obj, schema);
                    case "Boolean":
                        return testBoolean(obj, schema);
                    case "Date":
                        return testDate(obj, schema);
                    case "Array":
                        return testArray(obj, schema);
                    case "Object":
                        return testObject(obj, schema);
                    case "RegExp":
                        return testRegExp(obj, schema);
                    case "Function":
                        return testFunction(obj, schema);
                }
            }
        }
        return true;
    };
    
    var testString = function(string, schema)
    {
        if(typeof(string)!="string")
            return returnFalse("Object is not a string ['"+JSON.stringify(string,undefined,2)+"']");
        if(schema.MinLength != undefined && string.length < schema.MinLength)
            return returnFalse("String is smaller than MinLength "+schema.MinLength+" ['"+JSON.stringify(string)+"']");
        if(schema.MaxLength != undefined && string.length > schema.MaxLength)
            return returnFalse("String is greater than MaxLength "+schema.MaxLength+" ['"+JSON.stringify(string)+"']");
        if(schema.RegExp && !schema.RegExp.test(string))
            return returnFalse("String does not validate with RegExp ['"+JSON.stringify(string)+"']");
        if(schema.Values)
        {
            var valid = false;
            for(var i=0; i<schema.Values.length; i++)
            {
                if(string == schema.Values[i])
                {
                    valid = true;
                    break;
                }
            }
            if(!valid)
                return returnFalse("String does not match any of the given values ['"+JSON.stringify(string)+"']");
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(string == schema.NotValues[i])
                    return returnFalse("String matches one of the NotValues ("+schema.NotValues[i]+") ['"+JSON.stringify(string)+"']");
            }
        }
        return true;
    };
    
    var testNumber = function(num, schema)
    {
        if(typeof(num)!="number")
            return returnFalse("Object is not a Number ['"+JSON.stringify(num,undefined,2)+"']");
        if(schema.Max != undefined && num > schema.Max)
            return returnFalse("Number is bigger than Max "+schema.Max+" ['"+JSON.stringify(num)+"']");
        if(schema.Min != undefined && num < schema.Min)
            return returnFalse("Number is smaller than Min "+schema.Min+" ['"+JSON.stringify(num)+"']");
        if(schema.Unsigned && num < 0)
            return returnFalse("Number is Signed ['"+JSON.stringify(num)+"']");
        if(schema.Values)
        {
            var valid = false;
            for(var i=0; i<schema.Values.length; i++)
            {
                if(num == schema.Values[i])
                {
                    valid = true;
                    break;
                }
            }
            if(!valid)
                return returnFalse("Number does not match any of the given values ['"+JSON.stringify(num)+"']");
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(num == schema.NotValues[i])
                    return returnFalse("Number matches one of the NotValues ("+schema.NotValues[i]+") ['"+JSON.stringify(num)+"']");
            }
        }
        return true;
    };
    
    var testBoolean = function(bool, schema)
    {
        if(typeof(bool) != "boolean")
            return returnFalse("Object is not a boolean ['"+JSON.stringify(bool,undefined,2)+"']");
        if(schema.Values)
        {
            var valid = false;
            for(var i=0; i<schema.Values.length; i++)
            {
                if(bool == schema.Values[i])
                {
                    valid = true;
                    break;
                }
            }
            if(!valid)
                return returnFalse("Boolean does not match any of the given values ['"+JSON.stringify(bool)+"']");
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(bool == schema.NotValues[i])
                    return returnFalse("Boolean matches one of the NotValues ("+schema.NotValues[i]+") ['"+JSON.stringify(bool)+"']");
            }
        }
        return true;
    };
    var testDate = function(date, schema)
    {
        if(!(date instanceof Date))
            return returnFalse("Object is not a Date ["+date.toString()+"]");
        if(schema.MinDate != undefined && date < schema.MinDate)
            return returnFalse("Date is sooner than MinDate "+schema.MinDate+" ["+date.toString()+"]");
        if(schema.MaxDate != undefined && date > schema.MaxDate)
            return returnFalse("Date is later than MaxDate "+schema.MaxDate+" ["+date.toString()+"]");
        
        if(schema.Values)
        {
            var valid = false;
            for(var i=0; i<schema.Values.length; i++)
            {
                if(date == schema.Values[i])
                {
                    valid = true;
                    break;
                }
            }
            if(!valid)
                return returnFalse("Date does not match any of the given values ['"+date.toString()+"']");
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(date == schema.NotValues[i])
                    return returnFalse("Number matches one of the NotValues ("+schema.NotValues[i]+") ['"+date.toString()+"']");
            }
        }
        return true;
    };
    var testArray = function(array, schema)
    {
        if(!(array instanceof Array))
            return returnFalse("Object is not an array");
        if(schema.MinSize != undefined && array.length < schema.MinSize)
            return returnFalse("Array is smaller than MinSize "+schema.MinSize+" ['"+JSON.stringify(array)+"']");
        if(schema.MaxSize != undefined && array.length > schema.MaxSize)
            return returnFalse("Array is bigger than MaxSize "+schema.MaxSize+" ['"+JSON.stringify(array)+"']");
        if(schema.Values)
        {
            for(var i=0; i<array.length; i++)
            {
                var array_item = array[i];
                var valid = false;
                for(var j=0; j<schema.Values.length; j++)
                {
                    var value_schema = schema.Values[j];
                    if(test(array_item, value_schema))
                    {
                        valid=true;
                        break;
                    }
                }
                if(!valid)
                    return returnFalse("Invalid value for Array ["+JSON.stringify(array)+"]");
            }
        }
        if(schema.NotValues)
        {
            for(var i=0; i<array.length; i++)
            {
                var array_item = array[i];
                for(var j=0; j<schema.NotValues.length; j++)
                {
                    var value_schema = schema.NotValues[j];
                    if(test(array_item, value_schema))
                    {
                        _this.Error=null;
                        return returnFalse("Array contains one of the NotValues ("+schema.NotValues[j]+") ['"+JSON.stringify(array)+"']");
                    }
                }
            }
            _this.Error=null;
        }
        return true;
    };
    
    var testObject = function(object, schema)
    {
        if(! (object instanceof Object))
            return returnFalse("Object is not an Object ['"+JSON.stringify(object,undefined, 2)+"']");
        
        if(schema.Attributes)
        {
            
            for(var i=0; i<schema.Attributes.length; i++)
            {
                var schema_attribute = schema.Attributes[i];
                
                if(!test(object[schema_attribute.Name], schema_attribute, object))
                    return false;
                /*
                var has_attribute = object[schema_attribute.Name] !== undefined;
                
                //if condition is not met, dont check optional
                if(schema_attribute.Condition instanceof Function)
                {
                    if(has_attribute)
                    {
                        //we have it, so we need to check conditional
                        if(!schema_attribute.Condition(object))
                            return returnFalse("Attribute '"+schema_attribute.Name+"' did not meet condition on object ['"+JSON.stringify(object,undefined, 2)+"']");
                        
                        //check if it validates
                        if(!test(object[schema_attribute.Name], schema_attribute))
                            return returnFalse("Attribute '"+schema_attribute.Name+"' did not qualify on object ['"+JSON.stringify(object,undefined, 2)+"']");
                    }
                    //we don't have the attribute. But if we Do pass the condition, we'll need to check optional
                    else if(schema_attribute.Condition(object) && !schema_attribute.Optional)
                        return returnFalse("Attribute '"+schema_attribute.Name+"' not found while not optional ['"+JSON.stringify(object,undefined, 2)+"']");
                        
                    
                }
                else
                {
                    //if the option is not optional, and we don't have the option: false
                    if(!schema_attribute.Optional && !has_attribute)
                        return returnFalse("Attribute '"+schema_attribute.Name+"' not found while not optional ['"+JSON.stringify(object,undefined, 2)+"']");
                        
                    //if the have an attribute, but it doesn't comply: false
                    if(has_attribute && !test(object[schema_attribute.Name], schema_attribute))
                        return returnFalse("Attribute '"+schema_attribute.Name+"' did not qualify on object ['"+JSON.stringify(object,undefined, 2)+"']");
                }
                */
                
            }
        }
        if(!schema.CanHaveCustomAttributes)
        {
            for(var key in object)
            {
                if(!object.hasOwnProperty(key))
                    continue;
                
                if(!schema.Attributes)
                    return;
                var valid = false;
                for(var i=0; i<schema.Attributes.length; i++)
                {
                    var schema_attribute = schema.Attributes[i];
                    if(key == schema_attribute.Name)
                    {
                        valid = true;
                        break;
                    }
                }
                if(!valid)
                    return returnFalse("Attribute '"+key+"' is a custom attribute, while the schema does not have 'CanHaveCustomAttributes' set to true ['"+JSON.stringify(object,undefined, 2)+"']");
            }
        }
        
        return true;
    };
    
    var testRegExp = function(regexp, schema)
    {
        if(! ( regexp instanceof RegExp ))
            return false;
            
        if(schema.Values)
        {
            var valid = false;
            for(var i=0; i<schema.Values.length; i++)
            {
                if(regexp == schema.Values[i])
                {
                    valid = true;
                    break;
                }
            }
            if(!valid)
                return returnFalse("RegExp does not match any of the given values ['"+regexp.toString()+"']");
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(regexp == schema.NotValues[i])
                    return returnFalse("RegExp matches one of the NotValues ("+schema.NotValues[i]+") ['"+regexp.toString()+"']");
            }
        }
        return true;
    };
    var testFunction = function(func, schema)
    {
        if(! ( func instanceof Function))
            return returnFalse("Object is not a function ['"+func.toString()+"']");
            
        return true;
    };
    var testSchema = function(schema)
    {
        var jsd_schema =
        {
            Type: "Object",
            Attributes:
            [
                {
                    Name:"Type",
                    Type:"String",
                    Values: ["String","Number","Boolean","Array","Object","Boolean","Function"]
                },
                {
                    Name:"CanBeNull",
                    Type:"Boolean",
                    Optional: true
                },
                {
                    Name:"MaxLength",
                    Type:"Number",
                    Optional: true,
                    Condition: function(attribute,parent)
                    {
                        return parent.Type == "String";
                    }
                },
				{
				    Name:"MinLength",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "String";
					}
				},
				{
				    Name:"RegExp",
					Type:"RegExp",
					Optional: true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "String";
					}
				},
                {
				    Name:"Min",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "Number";
					}
				},
                {
				    Name:"Max",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "Number";
					}
				},
                {
				    Name:"Attributes",
					Type:"Array",
					Optional: true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "Object";
					}
				},
                {
                    Name:"CanHaveCustomAttributes",
                    Type:"Boolean",
                    Optional:true,
                    Condition: function(attribute,parent)
					{
					    return parent.Type == "Object";
					}
                }
                
            ],
            CanHaveCustomAttributes : false
        };
        
        if(typeof JSON !== 'object')
            return returnFalse('JSON is undefined. Did you forget to include json2.js?');
            
        jsd = new JSDValidator({Schema: jsd_schema});
        var result = jsd.Validate(schema);
        if(result)
            return true;
        return returnFalse(jsd.Error);
    };
    
    var returnFalse = function(message)
    {
        if(!_this.Error)
            _this.Error = message;
        return false;
    };
    var _this = this;
    var main_schema = undefined;
    var valid_schema = true;
    
    if(options != undefined)
    {
        if(options.Schema)
            main_schema = options.Schema;
        
        if(options.ValidateSchema)
        {
            valid_schema = testSchema(main_schema);            
        }
    }
    return true;
    
}
function JSD(){};
JSD.Link = function(object, attributes)
{
    function clone(obj)
    {
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor();

        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }
    var new_object = clone(object);
    for(var key in attributes)
    {
        if(!attributes.hasOwnProperty(key))
            continue;
        new_object[key] = attributes[key];
    }
    return new_object;
};