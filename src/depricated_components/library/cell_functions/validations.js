/*
Validations are functions that check to see if entered data or calculated fields are valid or not. Empty cell i.e null are accepted as valid.
The validations functions are defined in each page. And initialized by @/library/init_functions/function_init.js. The validation functions 
are then all added to the NodeId column which is initialized by @/library/init_functions/column_def_init


NodeId: This column displays 

__fieldname__is_valid__: ValueGetter and sets boolean?
__is_empty__: the is a funciton that requires the editable array. the editable array are all columns that should be checked for not null
    values if all values are null it returns true otherwise it returns false. Used to determine what crud operations to use.
__is_complete__: check if all rows have non null values
__is_changed__: compares editable fields to backups. if everything equivalent no change.
__is_incomplete__: checks all fields in the editable array per row. If a row has some values entered but not all it returns true. otherwise
    it returns false


In pages/xxx.vue

validations: {'function': 
    function (input_params) {
        return function (params) {
            return GreaterEqualTo(params,input_params.field_name, input_params.greater_equal_to)
        }
    }
    'input_params': {'greater_equal_to': 0, 'field_name': xxx}
}

If field_name is not defined it will be pulled from the field parameter in the columns definition. Default values for input_params are
added during the function_init calls. Anything not defined in the object is added by the init function if avaialble in the grid_column_rule or
in grid_params.

Example for autocomplete?
*/


function AutocompleteIsValid(params, map_function,field_name, field_backup_name) {
    /*
    This function checks if the autocomplete column is valid entry. This is true if no entry is placed, the value
    is equal to that in the backup column or the value in the column is found in the map_function

    params: object sent by aggrid
    map_function: created for the autocomplete. the map_function takes the value in ac_column_name and return the
        value from map_function[params.data[ac_column_name][column_filed]
    field_name: name of the column where the autocomplete is being used. the value from here is used for
        the getter calculation
    field_backup_name: the backup value. if the params.data[ac_column_name] === params.data[ac_column_backup_name] 
        the column will return getter_column_backup_field
    */
    if (params.data[field_name] === null) {return true} 
    if (params.data.hasOwnProperty(field_backup_name)) {
        if ( params.data[field_name] === params.data[field_backup_name] ) { return true }
    }
    if (map_function.hasOwnProperty(params.data[field_name] )) {return true}
    else {return false}
} //reject if not in map?


function AutocompleteIsValidInputParams(input_params) {
    return function (params) {
        var is_valid = AutocompleteIsValid(params, input_params['mapFunction'], input_params['field'], input_params['backup_field'])
        params.data[ input_params['validation_field']] = is_valid
        return is_valid

    }
}



function IsBetween(params,field_name, greater_equal_to, less_equal_to) {
    /*
    Many of the cFTE inputs and the final output must be between 0 and 1. This is a simple check
    for those values.
    */
    var appNum = params.data[field_name]
    if (appNum === null) {return true}
    if (isNaN(appNum)) {return false}
    var fNum = parseFloat(appNum)
    if ( (fNum <= less_equal_to) && (fNum >= greater_equal_to) ) {return true}
    return false
}

function IsBetweenInputParams(input_params) {
    return function (params) {
        var is_valid = IsBetween(params, input_params['field'], input_params['greater_equal_to'], input_params['less_equal_to'])
        params.data[ input_params['validation_field']] = is_valid
        return is_valid
    }
}

/*
This object contains the validation functions required for the Permissions Component.

*/
//check if it works?
function EmailValid (params, field_name) {
    //return DataEntered.IsEmpty(rowData,['email'])
    if (params.data[field_name] === null) {return true}
    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return re.test(params.data[field_name])
}

function EmailValidInputParams(input_params) {
    return function (params) {
        var is_valid = EmailValid(params, input_params['field']) 
        params.data[ input_params['validation_field']] = is_valid
        return is_valid
    }
}


function GreaterEqualTo(params,field_name, greater_equal_to) {
    var appNum = params.data[field_name]
    if (appNum === null) {return true}
    if (isNaN(appNum)) {return false}
    var fNum = parseFloat(appNum)
    if ( fNum >= greater_equal_to ) {return true}
    return false
}

function GreaterEqualToInputParams(input_params) {
    return function (params) {
        var is_valid = GreaterEqualTo(params, input_params['field'], input_params['greater_equal_to'])
        params.data[ input_params['validation_field']] = is_valid
        return is_valid

    }
}


function LessEqualTo(params,field_name, less_equal_to) {
    var appNum = params.data[field_name]
    if (appNum === null) {return true}
    if (isNaN(appNum)) {return false}
    var fNum = parseFloat(appNum)
    if ( fNum <= less_equal_to ) {return true}
    return false
}

function LessEqualToInputParams(input_params) {
    return function (params) {
        var is_valid = LessEqualTo(params, input_params['field'], input_params['less_equal_to'])
        params.data[ input_params['validation_field']] = is_valid
        return is_valid
    }
}

function LawsonCfteInputParams(input_params) {
    return function (params) {
        var dx = params.data
        var lawsonFTE      = dx['lawson_fte']
        var academic       = dx['academic']
        var contract    = dx['contract']
        var va             = dx['veterans_affairs']
        var administration = dx['administration']
        if (lawsonFTE === null || academic === null || contract === null 
            || va === null || administration === null) { 
                params.data[ input_params['validation_field']] = true        
                return true
        }
        var total = academic + contract + va + administration
        var cFTE = lawsonFTE - total
        // params.data['cfte'] = cFTE
        // console.log(cFTE)
        if (cFTE >= 0 && cFTE <= 1) {
            params.data[ input_params['validation_field']] = true
            return true
        } else { 
            params.data[ input_params['validation_field']] = false        
            return false

        }
    }
}



//For time based may just define in the corresponding page.
//Add specialty function directly to work_patterns and timebased cfte?
// function SessionInBounds(params) {
//     var session = params.data['sessions']
//     var timePerSession = params.data['timePerSession']
//     if (isNaN(session)||isNaN(timePerSession)) {return false}
//     session = parseFloat(session)
//     timePerSession = parseFloat(timePerSession)
//     if (session < 0 ) {return false}
//     else if (timePerSession < 0) {return false}
//     else if (timePerSession === 0 && session !== 0) {return false}
//     //else if (timePerSession < session) {return false}
//     else {return true}
// }

// function ShiftInBounds(rowData) {
//     var shift = rowData.data['shifts']
//     var timePerShift = rowData.data['timePerShift']
//     if (isNaN(shift)||isNaN(timePerShift)) {return false}
//     shift = parseFloat(shift)
//     timePerShift = parseFloat(timePerShift)
//     if (shift < 0 ) {return false}
//     else if (timePerShift < 0) {return false}
//     else if (timePerShift === 0 && shift !== 0) {return false}
//     //else if (timePerShift < shift) {return false}
//     else {return true}
// }


//IsNull
// function IsNull (numx) {
//     if ( numx === null ) {return true}
//     else if ( numx === undefined ) {return true}
//     else if (isNaN(numx)) {return true}
//     else { return false}
// }

module.exports = {
    'AutocompleteIsValid': AutocompleteIsValid,
    'IsBetween': IsBetween,
    'EmailValid': EmailValid,
    'GreaterEqualTo': GreaterEqualTo,
    'LessEqualTo': LessEqualTo,
    'AutocompleteIsValidInputParams': AutocompleteIsValidInputParams,
    'IsBetweenInputParams': IsBetweenInputParams,
    'EmailValidInputParams': EmailValidInputParams,
    'GreaterEqualToInputParams': GreaterEqualToInputParams,
    'LessEqualToInputParams': LessEqualToInputParams,
    'LawsonCfteInputParams': LawsonCfteInputParams
}