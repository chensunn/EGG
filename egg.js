//解析器 接受字符串，返回一个对象
function parseExpression(program){
  program = skipSpace(program);
  var match, expr;
  if(match = /^"([^"]*)"/.exec(program)) {  //字符串
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {  //数值
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),"]+/.exec(program)) {   //单词
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }
  return parseApply(expr, program.slice(match[0].length));
}
function skipSpace(string){
  var first = string.search(/\S/);
  if(first == -1){
    return "";
  }
  return string.slice(first);
}
//是否是一个应用，如果是，解析带括号的参数列表
function parseApply(expr, program){
  program = skipSpace(program);
  if(program[0] != "("){  //不是应用，直接返回表达式
    return {expr: expr, rest: program};
  }
  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while(program[0] != ")"){
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if(program[0] == ","){
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")"){
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}

function parse(program){
  var result = parseExpression(program);
  if(skipSpace(result.rest).length > 0){
    throw new SyntaxError("Unexpected text after program");
  }
  return result.expr;
}

console.log(parse("+(a, 10)"));
