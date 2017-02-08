var thisWeekOfYear = function(){
    var d = new Date;
    var first = d.getDate() - d.getDay();
    var last = first + 6
    return [new Date(first), new Date(last)];
};


exports.default = {
    thisWeekOfYear: thisWeekOfYear
}
