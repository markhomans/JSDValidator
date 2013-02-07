
var categories = ['Strings', 'Numbers', 'Booleans', 'Dates', 'Arrays', 'Objects', 'Functions', 'Multi-Types', 'Schemas'];
var debug = false;
var i = 1;

var tests_schema =
{
    Type: "Array",
    Values:
    [
        {
            Type: "Object",
            Attributes:
            [
                {
                    Name: "Category",
                    Type: "String",
                    Values: categories
                },
                {
                    Name: "Description",
                    Type: "String"
                },
                {
                    Name: "Schema",
                    Type: "Object",
                    CanHaveCustomAttributes: true,
                    Condition: function(obj,parent)
                    {
                        return parent.Category != "Schemas";
                    }
                },
                {
                    Name: "SchemaText",
                    Type: "String",
                    Optional: true
                },
                {
                    Name: "Inputs",
                    Type: "Array",
                    Values:
                    [
                        {
                            Type: "Object",
                            Attributes:
                            [
                                {
                                    Name: "Id",
                                    Type: "Number",
                                    Unsigned: true
                                },
                                {
                                    Name: "Input",
                                    CanBeNull: true
                                },
                                {
                                    Name: "InputText",
                                    Type: "String",
                                    Optional: true
                                },
                                {
                                    Name: "ExpectedResult",
                                    Type: "Boolean"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
    
$(document).ready(function()
{
    initTests();
    
    initNavBar();
    
    $('#header').affix();
    
    $('#cbx_break_on_run').parent().tooltip(
    {
        placement: "bottom"
    });
    
    prettyPrint();

});

function initNavBar()
{
    for(var cat_i=0; cat_i<categories.length; cat_i++)
    {
        var category = categories[cat_i];
        $('#nav-jsd-categories').append(
            "<li "+(cat_i==0?"class='active'":"")+">\
                <a href='#"+category+"'><i class='icon-chevron-right'></i> "+category+"</a>\
            </li>"
        );
    }
    
    var offset = 100;

    $('#nav-jsd-categories li a').click(function(event)
    {
        $('#nav-jsd-categories li').removeClass('active');
        $(this).parent().addClass('active');
        event.preventDefault();
        $($(this).attr('href'))[0].scrollIntoView();
        scrollBy(0, -offset);
    });
    
    $('.jsdv-sidebar').scrollspy();
    
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    });
}
function initTests()
{

    var jsd_validator = new JSDValidator({Schema: tests_schema});
    if(!jsd_validator.Validate(tests))
    {
        $('#tests-container').html('<br><h1>Could not initialise tests:</h1><p><h3>'+jsd_validator.Error+'</h3></p>')
        return;
    }

    var test_table = document.getElementById('tests-container');
    var tests_html = "";
    
    //loop though all the categories
    for(var cat_i=0; cat_i<categories.length; cat_i++)
    {
        var category = categories[cat_i];
        var category_html= "\
        <h2 id='"+category+"'>"+category+"</h2>\
        <table id='tests' class='table'>\
            <thead>\
                <tr>\
                    <th>Description</th>\
                    <th>JSD Schema</th>\
                    <th>Input</th>\
                    <th>Result</th>\
                    <th>Expected</th>\
                    <th><button class='btn btn-small btn_run_category_tests' type='button' category='"+category+"'>Run all '"+category+"' tests</button></th>\
                </tr>\
            </thead>\
            <tbody>\
        ";
        var category_test_count = 0;
        //get all tests
        for(var test_i=0; test_i<tests.length; test_i++)
        {
            var test = tests[test_i];
            
            if(test.Category != category)
                continue;

            var schema_text = test.SchemaText || (typeof JSON === 'object' ? JSON.stringify(test.Schema, undefined,2) : '<IE8, get json2.js');
            var test_html="";
            
            for(var input_i=0; input_i<test.Inputs.length; input_i++)
            {
                var input = test.Inputs[input_i];
                var input_text = input.InputText || (typeof JSON === 'object' ? JSON.stringify(input.Input,undefined,2): '<IE8, get json2.js');
                if(input_i==0)
                {
                    test_html += "<tr class='test' id='test_"+input.Id+"'>\
                                    <td class='test_definition test_description' rowspan="+test.Inputs.length+">"+test.Description+"</td>\
                                    <td class='test_definition test_schema' rowspan="+test.Inputs.length+"><pre class='prettyprint linenums'><small>"+schema_text+"</small></pre></td>\
                                    <td class='test_input'><pre class='prettyprint linenums'><small>"+input_text+"</small></pre></td>\
                                    <td class='test_result' id='result'></td>\
                                    <td class='test_expected'>"+input.ExpectedResult.toString()+"</td>\
                                    <td class='test_actions'><button class='btn btn-mini btn_run_test' type='button' test_id='"+input.Id+"'>Run test</button></td>\
                                </tr>";
                }
                else
                {
                    test_html += "<tr class='test' id='test_"+input.Id+"'>\
                                    <td class='test_input'><pre class='prettyprint linenums'><small>"+input_text+"</small></pre></td>\
                                    <td class='test_result' id='result'></td>\
                                    <td class='test_expected'>"+input.ExpectedResult.toString()+"</td>\
                                    <td class='test_actions'><button class='btn btn-mini btn_run_test' type='button' test_id='"+input.Id+"'>Run test</button></td>\
                                </tr>";
                }
                category_test_count++;
            }
            
            category_html += test_html;
        }
        category_html += "</tbody></table>";
        
        if(category_test_count>0)
            tests_html += category_html;
    }
    test_table.innerHTML = tests_html;
    
    $('#btn_run_all_tests').click(
        function(e)
        {
            runTests();
        }
    );
    
    $('.btn_run_category_tests').on('click',
        function(e)
        {
            runTests(this.getAttribute("category"));
        }
    );

    $('.btn_run_test').on('click',
        function(e)
        {
            runTestById(this.getAttribute("test_id"));
        }
    );

    $('#cbx_break_on_run').on('click',
        function(e)
        {
            debug =this.checked;
        }
    );
}

    
function runTests(category)
{
    for(var test_i=0;test_i<tests.length;test_i++)
    {
        if(category == undefined || tests[test_i].Category == category)
        {
            runTest(tests[test_i]);
        }
    }
}

function runTestById(id)
{
    for(var test_i=0; test_i<tests.length; test_i++)
    {
        var test = tests[test_i];
        
        for(var input_i=0; input_i<test.Inputs.length;input_i++)
        {
            if(test.Inputs[input_i].Id == id)
            {
                runTestWithInput(test, test.Inputs[input_i]);
                return;
            }
        }
    }   
}

function runTest(test)
{
    for(var input_i=0; input_i<test.Inputs.length;input_i++)
    {
        var input = test.Inputs[input_i];
        runTestWithInput(test, input);
    }
}

function runTestWithInput(test,input)
{
    var result, error, my_jsd;
    if(test.Category=="Schemas")
    {
        if(debug)
            debugger;
        my_jsd = new JSDValidator({Schema: input.Input});
        result = my_jsd.ValidateSchema();
        error = my_jsd.Error;
    }
    else
    {
        if(debug)
            debugger;
        my_jsd = new JSDValidator({Schema: test.Schema});
        
        //if(!my_jsd.ValidateSchema())
        //    result = false;
        //else
            result = my_jsd.Validate(input.Input);
            
        error = my_jsd.Error;
    }
    
    
    var $test_html = $("#test_"+input.Id);//document.getElementById('test_'+input.Id);
    
    if(result)
        $test_html.find('#result').html("true");//querySelector('#result').innerHTML = "true";
    else
    {
        $test_html.find('#result').html(
        //test_html.querySelector('#result').innerHTML =
            "false\
            <span id='validation-failed_"+input.Id+"' class='badge badge-important badge-image' title='Did not validate' >\
                <i class='icon-info-sign  icon-white'></i>\
            </span>");
    
        $("#validation-failed_"+input.Id).popover(
        {
            placement: "bottom",
            content: function(){ return error; }
        });

    }
    $test_html.removeClass(result==input.ExpectedResult?'error':'success');
    $test_html.addClass(result==input.ExpectedResult?'success':'error');
}

function syntaxHighlight(json)
{
    if (typeof json != 'string') {
         json = typeof JSON === 'object' ? JSON.stringify(json, undefined, 2) : json.toString();
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}