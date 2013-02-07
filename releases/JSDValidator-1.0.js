function JSDValidator(options)
{
    this.Error = null;
    
    this.SetSchema = function(jsd_schema)
    {
        main_schema = jsd_schema;
    }
    this.Validate = function(obj)
    {
        if(!valid_schema)
            return returnFalse(_this.Error);
        _this.Error = null;
        
        return test(obj, main_schema);
    }
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
            
    }
    var test = function(obj, schema)
    {
        if(schema == undefined)
            schema = main_schema;
        
        if(schema == undefined)
            return returnFalse("No JSD Schema defined");
        
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
        }
    }
    
    var testString = function(string, schema)
    {
        if(typeof(string)!="string")
            return returnFalse("Object is not a string ["+string.toString()+"]");
        if(schema.MinLength != undefined && string.length < schema.MinLength)
            return returnFalse("String is smaller than MinLength "+schema.MinLength+" ['"+string.toString()+"']");
        if(schema.MaxLength != undefined && string.length > schema.MaxLength)
            return returnFalse("String is greater than MaxLength "+schema.MaxLength+" ['"+string.toString()+"']");
        if(schema.RegExp && !schema.RegExp.test(string))
            return returnFalse("String does not validate with RegExp ['"+string.toString()+"']");
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
                return returnFalse("String does not match any of the given values ['"+string.toString()+"']");
        }
        return true;
    }
    
    var testNumber = function(num, schema)
    {
        if(typeof(num)!="number")
            return returnFalse("Object is not a Number ["+num.toString()+"]");
        if(schema.Max != undefined && num > schema.Max)
            return returnFalse("Number is bigger than Max "+schema.Max+" ["+num.toString()+"]");
        if(schema.Min != undefined && num < schema.Min)
            return returnFalse("Number is smaller than Min "+schema.Min+" ["+num.toString()+"]");
        if(schema.Unsigned && num < 0)
            return returnFalse("Number is Signed ["+num.toString()+"]");
        return true;
    }
    
    var testBoolean = function(bool, schema)
    {
        if(typeof(bool) != "boolean")
            return returnFalse("Object is not a boolean");
        return true;
    }
    var testDate = function(date, schema)
    {
        if(!(date instanceof Date))
            return returnFalse("Object is not a Date ["+date.toString()+"]");
        if(schema.MinDate != undefined && date < schema.MinDate)
            return returnFalse("Date is sooner than MinDate "+schema.MinDate+" ["+date.toString()+"]");
        if(schema.MaxDate != undefined && date > schema.MaxDate)
            return returnFalse("Date is later than MaxDate "+schema.MaxDate+" ["+date.toString()+"]");
        return true;
    }
    var testArray = function(array, schema)
    {
        if(!(array instanceof Array))
            return returnFalse("Object is not an array");
        if(schema.MinSize != undefined && array.length < schema.MinSize)
            return returnFalse("Array is smaller than MinSize "+schema.MinSize+" ['"+array.toString()+"']");
        if(schema.MaxSize != undefined && array.length > schema.MaxSize)
            return returnFalse("Array is bigger than MaxSize "+schema.MaxSize+" ['"+array.toString()+"']");
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
                    return returnFalse("Invalid value for Array ["+array.toString()+"]");
            }
        }
        return true;
    }
    
    var testObject = function(object, schema)
    {
        if(! (object instanceof Object))
            return false;
        
        if(schema.Attributes)
        {
            
            for(var i=0; i<schema.Attributes.length; i++)
            {
                var schema_attribute = schema.Attributes[i];
                
                //if we have an attribute, and the attribute's schema has a condition function, and we don't comply with the function: false
                if(schema_attribute.Condition instanceof Function && object[schema_attribute.Name] && !schema_attribute.Condition(object))
                    return returnFalse("Attribute '"+schema_attribute.Name+"' did not meet condition on object ['"+object.toString()+"']");
                //if the option is not optional, and we don't have the option: false
                if(!schema_attribute.Optional && !object[schema_attribute.Name])
                    return returnFalse("Attribute '"+schema_attribute.Name+"' not found while not optional ['"+object.toString()+"']");
                //if the have an attribute, but it doesn't comply: false
                if(object[schema_attribute.Name] && !test(object[schema_attribute.Name], schema_attribute))
                    return returnFalse("Attribute '"+schema_attribute.Name+"' did not qualify on object ['"+object.toString()+"']");
                
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
                    return returnFalse("Attribute '"+key+"' is a custom attribute, while the schema does not have 'CanHaveCustomAttributes' set to true ['"+object.toString()+"']");
            }
        }
        
        return true;
    }
    
    var testRegExp = function(regexp, schema)
    {
        if(! regexp instanceof RegExp)
            return false;
        return true;
    }
    /**
     * if the object has an attribute, and it has a condition, and we do not forfill the condition, then it's wrong
     */
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
                    Values: ["String","Number","Boolean","Array","Object","Boolean"]
                },
                {
                    Name:"MaxLength",
                    Type:"Number",
                    Optional: true,
                    Condition: function(attribute)
                    {
                        return attribute.Type == "String";
                    }
                },
				{
				    Name:"MinLength",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "String";
					}
				},
				{
				    Name:"RegExp",
					Type:"RegExp",
					Optional: true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "String";
					}
				},
                {
				    Name:"Min",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "Number";
					}
				},
                {
				    Name:"Max",
					Type:"Number",
					Optional: true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "Number";
					}
				},
                {
				    Name:"Attributes",
					Type:"Array",
					Optional: true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "Object";
					}
				},
                {
                    Name:"CanHaveCustomAttributes",
                    Type:"Boolean",
                    Optional:true,
                    Condition: function(attribute)
					{
					    return attribute.Type == "Object";
					}
                }
                
            ],
            CanHaveCustomAttributes : false
        };
        jsd = new JSDValidator({Schema: jsd_schema});
        var result = jsd.Validate(schema);
        if(result)
            return true;
        return returnFalse(jsd.Error);
    }
    
    var returnFalse = function(message)
    {
        _this.Error = message;
        return false;
    }
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