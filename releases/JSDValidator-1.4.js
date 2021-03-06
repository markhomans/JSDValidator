/*!
 * JSD Validator v1.4
 * http://www.build-software.nl/JSDValidator/
 *
 * Copyright 2013 Build-Software
 * Released under the FreeBSD license
 * http://www.freebsd.org/copyright/freebsd-license.html
 *
 * Date: 2013-01-31
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
        //warn if IE<=7 and json2.js is not loaded
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
                    return fail('errConditionNotMet', schema, obj);
            }
            //we don't have the attribute. But if we Do pass the condition, we'll need to check optional
            else if(schema.Condition(obj, parent_obj) && !schema.Optional)
                return fail('errUnfoundNonOptional', schema, obj);
        }
        else
        {
            //if the option is not optional, and we don't have the option: false
            if(!schema.Optional && !defined)
                return fail('errUnfoundNonOptional', schema, obj);
        }
        //only continue validating if defined
        if(defined)
        {
            //check null
            if(obj==null)
            {
                if(!schema.CanBeNull)
                    return fail('errCantBeNull', schema, obj);
                return true;
            }
            
            var valid = false;
            
            //check type
            if(schema.Type)
            {
                switch(schema.Type)
                {
                    case "String":
                        valid = testString(obj, schema);
                        break;
                    case "Number":
                        valid = testNumber(obj, schema);
                        break;
                    case "Boolean":
                        valid = testBoolean(obj, schema);
                        break;
                    case "Date":
                        valid = testDate(obj, schema);
                        break;
                    case "Array":
                        valid = testArray(obj, schema);
                        break;
                    case "Object":
                        valid = testObject(obj, schema);
                        break;
                    case "RegExp":
                        valid = testRegExp(obj, schema);
                        break;
                    case "Function":
                        valid = testFunction(obj, schema);
                        break;
                    case "MultiType":
                        valid = testMultiType(obj, schema);
                        break;
                }
                if(!valid)
                    return false;
                
                //do the final validation
                if(schema.Validate && !schema.Validate(obj, parent_obj))
                    return fail('errValidate', schema, obj);;
            }
        }
        return true;
    };
    
    var testString = function(string, schema)
    {
        if(typeof(string)!="string")
            return fail('errWrongType', schema, string);
        if(schema.MinLength != undefined && string.length < schema.MinLength)
            return fail('errMinLength', schema, string);
        if(schema.MaxLength != undefined && string.length > schema.MaxLength)
            return fail('errMaxLength', schema, string);            
        if(schema.RegExp && !schema.RegExp.test(string))
            return fail('errRegExp', schema, string);
            
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
                return fail('errNoMatchedValue',schema, string);
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(string == schema.NotValues[i])
                    return fail('errMatchedNotValue',schema, string);
            }
        }
        return true;
    };
    
    var testNumber = function(num, schema)
    {
        if(typeof(num)!="number")
            return fail('errWrongType', schema, num);
        if(schema.Max != undefined && num > schema.Max)
            return fail('errMax', schema, num);
        if(schema.Min != undefined && num < schema.Min)
            return fail('errMin', schema, num);
        if(schema.Unsigned && num < 0)
            return fail('errSigned', schema, num);
            
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
                return fail('errNoMatchedValue',schema, string);
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(num == schema.NotValues[i])
                    return fail('errMatchedNotValue',schema, string);
            }
        }
        return true;
    };
    
    var testBoolean = function(bool, schema)
    {
        if(typeof(bool) != "boolean")
            return fail('errWrongType', schema, bool);
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
                return fail('errNoMatchedValue',schema, string);
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(bool == schema.NotValues[i])
                    return fail('errMatchedNotValue',schema, string);
            }
        }
        return true;
    };
    var testDate = function(date, schema)
    {
        if(!(date instanceof Date))
            return fail('errWrongType', schema, date);
        if(schema.MinDate != undefined && date < schema.MinDate)
            return fail('errMinDate', schema, date);
        if(schema.MaxDate != undefined && date > schema.MaxDate)
            return fail('errMaxDate', schema, date);
        
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
                return fail('errNoMatchedValue',schema, date);
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(date == schema.NotValues[i])
                    return fail('errMatchedNotValue',schema, date);
            }
        }
        return true;
    };
    var testArray = function(array, schema)
    {
        if(!(array instanceof Array))
            return fail('errWrongType', schema, array);
        if(schema.MinSize != undefined && array.length < schema.MinSize)
            return fail('errMinSize', schema, array);
        if(schema.MaxSize != undefined && array.length > schema.MaxSize)
            return fail('errMaxSize', schema, array);
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
                    return fail('errNoMatchedValue',schema, array);
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
                        return fail('errMatchedNotValue',schema, array);
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
            return fail('errWrongType', schema, object);
        
        if(schema.Attributes)
        {
            
            for(var i=0; i<schema.Attributes.length; i++)
            {
                var schema_attribute = schema.Attributes[i];
                
                if(!test(object[schema_attribute.Name], schema_attribute, object))
                    return false;                
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
                    return fail('errCustomAttribute',schema, object, {'key':key});
            }
        }
        
        return true;
    };
    
    var testRegExp = function(regexp, schema)
    {
        if(! ( regexp instanceof RegExp ))
            return fail('errWrongType', schema, regexp);
            
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
                return fail('errNoMatchedValue',schema, regexp);
        }
        if(schema.NotValues)
        {
            for(var i=0; i<schema.NotValues.length; i++)
            {
                if(regexp == schema.NotValues[i])
                    return fail('errMatchedNotValue',schema, regexp);
            }
        }
        return true;
    };
    var testFunction = function(func, schema)
    {
        if(! ( func instanceof Function))
            return fail('errWrongType', schema, func);
            
        return true;
    };
    var testMultiType = function(obj, schema)
    {
        var valid = false;
        for(var i=0; i< schema.Types.length; i++)
        {
            if(test(obj, schema.Types[i]))
            {
                valid = true;
                break;
            }
        }
        //reset error anyway. If we pass, remove the failed types. if we fail, we want to set the multitype error, not the specific one
        _this.Error = false;
        if(!valid)
            return fail('errMultiType',schema, obj);
            
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
    var fail = function(id, schema, obj, params)
    {
        if(schema[id]!==undefined && typeof(schema[id])=="string")
            return returnFalse(schema[id]);
        
        switch(id)
        {
            //general messages
            case 'errWrongType':
                return returnFalse(typeof(obj) + " is not a "+schema.Type+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined,2)+"']");
            case 'errNoMatchedValue':
                return returnFalse(typeof(obj) + " does not match any of the given values ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined,2)+"']");
            case 'errMatchedNotValue':
                return returnFalse(typeof(obj) + " matches one of the NotValues ("+schema.NotValues[i]+") ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined,2)+"']");
            case 'errConditionNotMet':
                return returnFalse("Condition did not get met on "+typeof(obj)+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined, 2)+"']");
            case 'errUnfoundNonOptional':
                return returnFalse(typeof(obj) + " not found while not optional ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined, 2)+"']");
            case 'errCantBeNull':
                return returnFalse("Object can't be null ["+(schema.Name?schema.Name+": ":"")+""+JSON.stringify(obj, undefined,2)+"]");
            case 'errValidate':
                return returnFalse(typeof(obj) + " did not pass the Validate function ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined, 2)+"']");
    
            //string messages
            case 'errMinLength':
                return returnFalse("String is smaller than MinLength "+schema.MinLength+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");       
            case 'errMaxLength':
                return returnFalse("String is greater than MaxLength "+schema.MaxLength+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            case 'errRegExp':
                return returnFalse("String does not validate with RegExp "+schema.RegExp.toString()+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            
            //number messages
            case 'errMax':
                return returnFalse("Number is bigger than Max "+schema.Max+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            case 'errMin':
                return returnFalse("Number is smaller than Min "+schema.Min+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            case 'errSigned':
                return returnFalse("Number is Signed ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            
            //date messages
            case 'errMinDate':
                return returnFalse("Date is sooner than MinDate "+schema.MinDate+" ["+(schema.Name?schema.Name+": ":"")+""+obj.toString()+"]");
            case 'errMaxDate':
                return returnFalse("Date is later than MaxDate "+schema.MaxDate+" ["+(schema.Name?schema.Name+": ":"")+""+obj.toString()+"]");
            
            //array messages
            case 'errMinSize':
                return returnFalse("Array is smaller than MinSize "+schema.MinSize+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            case 'errMaxSize':
                return returnFalse("Array is bigger than MaxSize "+schema.MaxSize+" ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            
            //object messages
            case 'errCustomAttribute':
                return returnFalse("Attribute '"+params.key+"' is a custom attribute, while the schema does not have 'CanHaveCustomAttributes' set to true ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj,undefined, 2)+"']");
            
            //multitype messages
            case 'errMultiType':
                return returnFalse(typeof(obj) + " did not validate on any type of the multi types ["+(schema.Name?schema.Name+": ":"")+"'"+JSON.stringify(obj)+"']");
            
        }
        //default message
        return returnFalse("Object did not validate ["+(schema.Name?schema.Name+": ":"")+"'"+obj.toString()+"']");
        
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