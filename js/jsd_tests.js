var tests = [];
//strings
tests = tests.concat(
[
    {
        Category: "Strings",
        Description: "Basic String, no restrictions",
        Schema: { Type: "String" },
        Inputs:
        [
            {
                Id:i++,
                Input: "This is a simple string",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 100,
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: null,
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Strings",
        Description: "String with max and min length",
        Schema: { Type: "String", MaxLength:10, MinLength:3},
        Inputs:
        [
            {
                Id:i++,
                Input: "This string is longer than 10 chars",
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: "<10 && >3",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "<3",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Strings",
        Description: "Nullable string",
        Schema: { Type: "String", CanBeNull:true},
        Inputs:
        [
            {
                Id:i++,
                Input: null,
                ExpectedResult: true
            }
        ]
    },
    {
        Category: "Strings",
        Description: "String qualified by RegExp",
        Schema: { Type: "String", RegExp:/[A-Z][a-z]*\s[A-Z][a-z]/ },
        SchemaText: "{\n  \"Type\": \"String\",\n  \"RegExp\": /[A-Z][a-z]*\\s[A-Z][a-z]/\n}",
        Inputs:
        [
            {
                Id:i++,
                Input: "Mark Homans",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "123",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Strings",
        Description: "Don't allow (some) reserved words",
        Schema: { Type: "String", NotValues: ["if","else","break","continue","return","new"] },
        Inputs:
        [
            {
                Id:i++,
                Input: "foo",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "continue",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Strings",
        Description: "a valid variable name",
        Schema:
        {
            Type: "String",
            RegExp: /^[^;(\s]+$/,
            Validate: function(obj)
            {
                try
                {
                    eval("var "+obj+" = null;");
                }
                catch(e)
                {
                    return false;
                }
                return true;
            }
        },
        SchemaText:"{\n\
  \"Type\": \"String\",\n\
  \"RegExp\": /^[^;(\\s]+$/,\n\
  \"Validate\": function(obj)\n\
  {\n\
    try\n\
    {\n\
      eval(\"var \"+obj+\" = null;\");\n\
    }\n\
    catch(e)\n\
    {\n\
      return false;\n\
    }\n\
    return true;\n\
  }\n\
}",
        Inputs:
        [
            {
                Id:i++,
                Input: "foo",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "continue",
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: "foo=null; alert('hack');var bar",
                ExpectedResult: false
            }
        ]
    }
]);
//Numbers
tests = tests.concat(
[
    {
        Category: "Numbers",
        Description: "Any number",
        Schema: { Type: "Number"},
        Inputs:
        [
            {
                Id:i++,
                Input: 5,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 5.5,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: -5,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: -5.5,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "this is a string",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Numbers",
        Description: "Min 0 & Max 100",
        Schema: { Type: "Number", Min: 0, Max: 100},
        Inputs:
        [
            {
                Id:i++,
                Input: 50,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 110,
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: -10,
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Numbers",
        Description: "Unsigned",
        Schema: { Type: "Number", Unsigned: true},
        Inputs:
        [
            {
                Id:i++,
                Input: 10,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: -10,
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Numbers",
        Description: "Integers",
        Schema: { Type: "Number", Integer: true},
        Inputs:
        [
            {
                Id:i++,
                Input: 10,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 10.5,
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Numbers",
        Description: "Only get even numbers",
        Schema: 
        { 
            Type: "Number",
            Condition: function(num)
            {
                return num %2==0;
            }
        },
        SchemaText: "{\n\
  \"Type\": \"Number\",\n\
  \"Condition\": function(num)\n\
  {\n\
    return num %2==0;\n\
  }\n\
}",
        Inputs:
        [
            {
                Id:i++,
                Input: 5,
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: 6,
                ExpectedResult: true
            }
        ]
    }
]);
//Booleans
tests = tests.concat(
[
    {
        Category: "Booleans",
        Description: "Simple boolean",
        Schema: { Type: "Boolean"},
        Inputs:
        [
            {
                Id:i++,
                Input: true,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: false,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 'true',
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Dates",
        Description: "a date",
        Schema: { Type: "Date"},
        Inputs:
        [
            {
                Id:i++,
                Input: new Date(),
                InputText: "new Date()",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "2012/12/21",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Dates",
        Description: "Dates with min or max",
        Schema: { Type: "Date", MaxDate: new Date("2012/12/21"), MinDate: new Date("1981/07/15")},
        SchemaText: "{\n  Type: \"Date\",\n  MaxDate: new Date(\"2012/12/21\"),\n  MinDate: new Date(\"1981/07/15\")\n}",
        Inputs:
        [
            {
                Id:i++,
                Input: new Date("2012/01/01"),
                InputText: "new Date(\"2012/01/01\")",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: new Date("2013/01/01"),
                InputText: "new Date(\"2013/01/01\")",
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: new Date("1980/01/01"),
                InputText: "new Date(\"1980/01/01\")",
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Arrays",
        Description: "Any given array",
        Schema: { Type: "Array"},
        Inputs:
        [
            {
                Id:i++,
                Input: ['A',2],
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: {a:'A',b:2},
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Arrays",
        Description: "Array with specific values. Unsigned numbers or Strings with at least 1 char",
        Schema: { Type: "Array", Values:[{ Type: "Number", Unsigned:true }, { Type: "String", MinLength:1}]},
        Inputs:
        [
            {
                Id:i++,
                Input: ['A',1],
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: ['A',-1],
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: ['',1],
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Arrays",
        Description: "Array with specific NotValues",
        Schema: { Type: "Array", NotValues:[{ Type: "Function" }, { Type: "RegExp"},{ Type: "Date"}]},
        Inputs:
        [
            {
                Id:i++,
                Input: ['A',1],
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: ['A',function(){alert('Hello world');}],
                InputText:"[\n\
  'A',\n\
  function()\n\
  {\n\
    alert('Hello world');\n\
  }", 
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Arrays",
        Description: "Array with min size of 3, max size of 10",
        Schema: { Type: "Array", MinSize: 3, MaxSize: 10 },
        Inputs:
        [
            {
                Id:i++,
                Input: [1,2,3,4,5],
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: [1,2],
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: [1,2,3,4,5,6,7,8,9,10,11],
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Objects",
        Description: "A person",
        Schema: 
        {
            Type: "Object", 
            Attributes:
            [
                { Name:"FirstName", Type:"String" },
                { Name:"LastName", Type:"String" },
                { Name:"Age", Type:"Number", Unsigned:true }, 
                { Name:"Gender", Type:"String", Values:["M","F"] }
            ],
            CanHaveCustomAttributes : false
        },
        Inputs:
        [
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Mark",
                    LastName: "Homans",
                    Age: 30,
                    Gender: "M"
                },
                ExpectedResult: true
            },
            
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Mark",
                    Age: 30,
                    Gender: "M"
                },
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Mark",
                    LastName: "Homans",
                    Age: 30,
                    Gender: "M",
                    Country: "The Netherlands"
                },
                ExpectedResult: false
            }
        ]
    },
    {
        Category: "Objects",
        Description: "A person, with conditional breast size",
        Schema: 
        {
            Type: "Object",
            Attributes: [
            {
                Name: "FirstName",
                Type: "String"
            },
            {
                Name: "MiddleName",
                Type: "String",
                Optional: true
            },
            {
                Name: "LastName",
                Type: "String"
            },
            {
                Name: "Age",
                Type: "Number",
                Unsigned: true
            },
            {
                Name: "Gender",
                Type: "String",
                Values: [
                    "M",
                    "F"
                ]
            },
            {
                Name: "BreastSize",
                Type: "String",
                RegExp: /\d{2}[A-F]{1,3}/,
                Condition: function(attribute,parent)
                {
                    //don't allow BreastSize attribute on Male objects
                    return parent.Gender == "F";
                }
            }
            ],
            "CanHaveCustomAttributes": false
        },
        SchemaText:
"{\n\
  \"Type\": \"Object\",\n\
  \"Attributes\": [\n\
    {\n\
      \"Name\": \"FirstName\",\n\
      \"Type\": \"String\"\n\
    },\n\
    {\n\
      \"Name\": \"MiddleName\",\n\
      \"Type\": \"String\",\n\
      \"Optional\": true\n\
    },\n\
    {\n\
      \"Name\": \"LastName\",\n\
      \"Type\": \"String\"\n\
    },\n\
    {\n\
      \"Name\": \"Age\",\n\
      \"Type\": \"Number\",\n\
      \"Unsigned\": true\n\
    },\n\
    {\n\
      \"Name\": \"Gender\",\n\
      \"Type\": \"String\",\n\
      \"Values\": [\n\
        \"M\",\n\
        \"F\"\n\
      ]\n\
    },\n\
    {\n\
      \"Name\": \"BreastSize\",\n\
      \"Type\": \"String\",\n\
      \"RegExp\": /\d{2}[A-F]{1,3}/,\n\
      \"Condition\": function(attribute,parent)\n\
      {\n\
          //don't allow BreastSize attribute on Male objects\n\
          return parent.Gender == \"F\";\n\
      }\n\
    }\n\
  ],\n\
  \"CanHaveCustomAttributes\": false\n\
}",
        Inputs:
        [
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Jane",
                    LastName: "Doe",
                    Age: 28,
                    Gender: "F",
                    BreastSize: "38D"
                },
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Jane",
                    LastName: "Doe",
                    Age: 28,
                    Gender: "F"
                },
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Mark",
                    LastName: "Homans",
                    Age: 30,
                    Gender: "M",
                    BreastSize: "00"
                },
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: 
                {
                    FirstName: "Mark",
                    LastName: "Homans",
                    Age: 30,
                    Gender: "M"
                },
                ExpectedResult: true
            }
        ]
        
    }
 ]);
var jsd_address =
{
    Type: "Object",
    Attributes: [
        {
            Name: "City",
            Type: "String"
        },
        {
            Name: "Street",
            Type: "String"
        },
        {
            Name: "Housenumber",
            Type: "Number"
        }
    ]
}
var jsd_person =
{
    Type: "Object",
    Attributes: [
        {
            Name: "FirstName",
            Type: "String"
        },
        {
            Name: "LastName",
            Type: "String"
        },
        JSD.Link(jsd_address,{Name:"HomeAddress"})
    ]
}
var mark = 
{
    FirstName: "Mark",
    LastName: "Homans",
    HomeAddress:
    {
        City: "Voorburg",
        Street: "Van de Wateringelaan",
        Housenumber: 83
    }
}
var john = 
{
    FirstName: "John",
    LastName: "Doe",
    HomeAddress:
    {
        City: "Meerdijk",
        Street: "Paralelweg",
        Housenumber: 1
    }
}
 tests.push(
    {
        Category: "Objects",
        Description: "Linking Persons to a Company.<br>note how we link schema elements to the schema. This enables us to reuse certain definitions",
        Schema:
        {
            Type: "Object",
            Attributes: [
                {
                    Name: "CompanyName",
                    Type: "String"
                },
                JSD.Link(jsd_address, { Name:"CompanyAddress"}),
                JSD.Link(jsd_person, { Name:"CEO", Condition: function(obj_ceo,parent_obj_company)
					{
                        for(var i=0; i<parent_obj_company.Employees.length; i++)
                        {
                            if(parent_obj_company.Employees[i]==obj_ceo)
                                return false;
                        }
					    return true;
					}
                }),
                {
                    Name: "Employees",
                    Type: "Array",
                    Values: [jsd_person]
                }
            ]
        },
        SchemaText:
"var jsd_address =\n\
{\n\
  \"Type\": \"Object\",\n\
  \"Attributes\": [\n\
    {\n\
      \"Name\": \"City\",\n\
      \"Type\": \"String\"\n\
    },\n\
    {\n\
      \"Name\": \"Street\",\n\
      \"Type\": \"String\"\n\
    },\n\
    {\n\
      \"Name\": \"Housenumber\",\n\
      \"Type\": \"Number\"\n\
    }\n\
  ]\n\
}\n\
var jsd_person =\n\
{\n\
  \"Type\": \"Object\",\n\
  \"Attributes\": [\n\
    {\n\
      \"Name\": \"FirstName\",\n\
      \"Type\": \"String\"\n\
    },\n\
    {\n\
      \"Name\": \"LastName\",\n\
      \"Type\": \"String\"\n\
    },\n\
    JSD.Link(jsd_address,{\"Name\":\"HomeAddress\"})\n\
  ]\n\
}\n\
var jsd_company =\n\
{\n\
  \"Type\": \"Object\",\n\
  \"Attributes\": [\n\
    {\n\
      \"Name\": \"CompanyName\",\n\
      \"Type\": \"String\"\n\
    },\n\
    JSD.Link(jsd_address,\n\
    {\n\
      \"Name\":\"CompanyAddress\",\n\
    }),\n\
    JSD.Link(jsd_person, \n\
    {\n\
      \"Name\":\"CEO\",\n\
      \"Condition\": function(obj_ceo,parent_obj_company)\n\
      {\n\
        for(var i=0; i&lt;parent_obj_company.Employees.length; i++)\n\
        {\n\
          if(parent_obj_company.Employees[i]==obj_ceo)\n\
            return false;\n\
        }\n\
        return true;\n\
      }\n\}),\n\
    {\n\
      \"Name\": \"Employees\",\n\
      \"Type\": \"Array\",\n\
      \"Values\": [jsd_person]\n\
    }\n\
  ]\n\
}\n\
",
        Inputs:
        [
            {
                Id:i++,
                Input: 
                {
                    CompanyName: "Build-Software",
                    CompanyAddress: 
                    {
                        City: "Den Haag",
                        Street: "Gedempte Burgwal",
                        Housenumber: 2
                    },
                    CEO: mark
                    ,
                    Employees: [john]
                },
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 
                {
                    CompanyName: "Build-Software",
                    CompanyAddress: 
                    {
                        City: "Den Haag",
                        Street: "Gedempte Burgwal",
                        Housenumber: 2
                    },
                    CEO: mark
                    ,
                    Employees: [john,mark]
                },
                ExpectedResult: false
            }
        ]
    });
 
 tests.push(
 {
    Category: "Functions",
    Description: "a javascript function",
    Schema:
    {
        Type:"Function"
    },
    Inputs:
    [
        {
            Id:i++,
            Input: function Foo(){ alert("bar"); },
            InputText: "function Foo()\n{\n  alert(\"bar\");\n}",
            ExpectedResult: true
        }
    ]
 }
 );
 tests.push(
 {
    Category: "Functions",
    Description: "an object with a few functions",
    Schema:
    {
        Type:"Object",
        Attributes:
        [
            {
                Name: "Name",
                Type: "String"
            },
            {
                Name: "Eat",
                Type: "Function"
            },
            {
                Name: "Sleep",
                Type: "Function"
            }
        ]
    },
    Inputs:
    [
        {
            Id:i++,
            Input:
                {
                    Name: "Mark",
                    Eat: function(){ alert("eating");},
                    Sleep: function(){ alert("sleeping");}
                },
            InputText: "{\n\
  \"Name\": \"Mark\",\n\
  \"Eat\": function()\n\
  {\n\
    alert(\"eating\");\n\
  },\n\
  \"Sleep\": function()\n\
  {\n\
    alert(\"sleeping\");\n\
  }\n\
}",
            ExpectedResult: true
        },
        {
            Id:i++,
            Input:
                {
                    Name: "Mark",
                    Eat: function(){ alert("eating");},
                    Sleep: "sleeping"
                },
            InputText: "{\n\
  \"Name\": \"Mark\",\n\
  \"Eat\": function()\n\
  {\n\
    alert(\"eating\");\n\
  },\n\
  \"Sleep\": \"sleeping\"\n\
}",
            ExpectedResult: false
        }
    ]
 }
 );
 tests.push(
 {
        Category: "Multi-Types",
        Description: "Validate an object against more than one type",
        Schema:
        {
            Type: "MultiType",
            Types:
            [
                {
                    Type: "String",
                    RegExp: /^\d+$/
                },
                {
                    Type: "Number",
                    Unsigned: true
                }
            ]
        },
        SchemaText:
"{\n\
  \"Type\": \"MultiType\",\n\
  \"Types\":\n\
  [\n\
    {\n\
      \"Type\": \"String\",\n\
      \"RegExp\": /^\\d+$/\n\
    },\n\
    {\n\
      \"Type\": \"Number\",\n\
      \"Unsigned\": true\n\
    }\n\
  ]\n\
}",
        Inputs:
        [
            {
                Id:i++,
                Input: "100",
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 100,
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: "100a",
                ExpectedResult: false
            }
        ]
    }
);

 tests.push(
 {
        Category: "Schemas",
        Description: "Check for valid JSD schema",
        Inputs:
        [
            {
                Id:i++,
                Input: 
                { Type: "String", MaxLength:100},
                ExpectedResult: true
            },
            {
                Id:i++,
                Input: 
                { Type: "String", Max:100},
                ExpectedResult: false
            },
            {
                Id:i++,
                Input: 
                { Type: "String", MaxLength:10.5},
                ExpectedResult: false
            }
        ],
        SchemaText: "JSD's internal schema validator"
    }
);
