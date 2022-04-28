<template>
    <main-page 
        :query_rules="query_rules"
        :query_pagination="query_pagination"
        :query_params="query_params"
        :table_name="table_name"
        :query_routes="query_routes"
        :new_input_params="new_input_params"
        :save_route="save_route"
        :grid_column_rules="grid_column_rules"
        :table_id="table_id"
    >
    </main-page>
</template>


<script>
import MainPage from '@/components/main_page'

import value_getter from '@/library/cell_functions/value_getter'
import value_setter from '@/library/cell_functions/value_setter'
import value_formatter from '@/library/cell_functions/value_formatter'
import cell_style from '@/library/cell_functions/cell_style'
import editable from '@/library/cell_functions/editable'
import field_functions from '@/library/app_functions/field_functions'

const table_id_main = 16
var help_msg = `
<p>Time Based cFTE</p>
<ul>
  <li>appointment_code: appointment identifer. All providers in your specialty permissions assignment that are active</li>
  <li>effective_date: mm/dd/yyyy. The date the cfte is to take affect.</li>
  <li>work_pattern_code: Contains the definition used to determine how long a full cfte is. Defines max_shifts, max_sessions and
    how long each one is.</li>
  <li>shifts: Between 0 and max_shifts. </li>
  <li>sessions: Between 0 and max_sessions.</li>
  <li>specialty_match: the appointment_code and the work_pattern_code should have the same specialty code. Errors on mismatch</li>
  <li>shifts_alloted_time: Converts shifts to the expected total time for shifts</li>
  <li>sessions_alloted_time: Converts sessions to the expected total time for sessions</li>
  <li>cfte_alloted_time: shifts_alloted_time + sessions_alloted_time</li>
  <li>cfte_max_time: shifts_max_time + sessions_max_time. The time defined by the work_patterns definition for a 1.0 cfte</li>
  <li>cfte: Between 0 and 1. cfte = cfte_alloted_time/cfte_max_time</li>
</ul>
`



export default {
    components: { MainPage},
    // components: { MainPage},
    data() {
        return {
            // local_rowData: [],
            table_name: "Time Based",
            table_id: table_id_main,
            query_rules: [
                {'variable_name': 'last_name','data_describe': "last name of the provider",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'first_name','data_describe': "first_name of the provider",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'shifts','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'sessions','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cfte','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },

                {'variable_name': 'cpsc_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cpsc_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'lcg_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'lcg_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },


                {'variable_name': 'entity_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'entity_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'department_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'department_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'specialty_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'specialty_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'cost_center_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cost_center_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'npi','data_describe': "provider npi number",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'employee_number','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'is_active','data_describe': "is appointment active",'is_sort': true, 'is_filter': true, 'filter_active': true, 'filter_show': false, 'data_type': 'boolean', 'query_type': 'boolean', 'value': true },
                {'variable_name': 'email','data_describe': "email of the user who last modified the data",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },

                {'variable_name': 'effective_date','data_describe': "sort based on when row was last modified",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'date', 'query_type': '', 'value': '' },
                {'variable_name': 'updated_at','data_describe': "sort based on when row was last modified",'is_sort': true, 'is_filter': false, 'filter_active': false, 'filter_show': false, 'data_type': 'date', 'query_type': '', 'value': '' },
                {'variable_name': 'id','data_describe': "postgres table id",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'integer', 'query_type': 'in', 'value': null },
            ],
            query_pagination : {'offset': 0, 'limit': 500},
            query_params: {
                'permissions': {'is_assigned_filter': true},
                'quick_filter': {'data_describe': "Does a quick search against all table fields."},
                'default_query_route': 'current_cfte(i)', 'help_modal': {'help_msg': help_msg }
                //default query_params based on permissions.
            },
            query_routes: { //need to have save route inorder to define how default values will be added
                    'default': {'route':'/data/grids/cfte/time_based_cftes/get', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls lcg data'},
                    'current_cfte(i)': {'route':'/data/grids/cfte/time_based_cftes/current_cfte', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls current cfte'},
                    'current_cfte(u)': {'route':'/data/grids/cfte/time_based_cftes/current_cfte', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls current cfte'},
                    'new_appointments': {'route':'/data/grids/cfte/time_based_cftes/new_appointments', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls appointments without cfte'},
                    'latest_cfte(i)': {'route':'/data/grids/cfte/time_based_cftes/latest_cfte', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls latest cfte'},
                    'latest_cfte(u)': {'route':'/data/grids/cfte/time_based_cftes/latest_cfte', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls latest cfte'},

                    // 'save': //
            },
            //user_permissions: {'user_permissions': ,'route':}
            new_input_params: {'__save_route__': 'upsert'},
            save_route: '/data/grids/cfte/time_based_cftes/save',
            grid_column_rules: [

                {
                    field: 'last_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'last_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'last_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'first_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'first_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'first_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'employee_number',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'employee_number', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'employee_number', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    //return value not implemented :(
                    // headerName: 'classification_name',
                    field: 'appointment_code',
                    width: 150,
                    is_server_field: true,
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    data_type: "autocomplete",
                    cellEditorFramework: 'AutocompleteAg',
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueAutocompleteSetterInputParams, 'input_params': {} },               
                    cellEditorParams: {
                        return_value: 'appointment_code',
                        return_null: true,
                        crud_value: 'id',
                        column_info: [
                            {header: "last_name", init_width: 100},
                            {header: "first_name", init_width: 100},
                            {header: "npi", init_width: 100},
                            {header: "employee_number", init_width: 130},
                            {header: "cost_center_code", init_width: 130},
                            {header: "cost_center_name", init_width: 200},
                            {header: "entity_department_specialty_code", init_width: 200},
                            {header: "classification_name", init_width: 130},
                            {header: "id" , init_width: 75}
                        ],
                        map_params: {'table_id': table_id_main},
                        map_route: '/data/grids/providers/appointments/maps',
                        return_field: 'appointment_id'
                    },
                },
                {
                    //return value not implemented :(
                    // headerName: 'classification_name',
                    field: 'work_pattern_code',
                    width: 150,
                    is_server_field: true,
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    data_type: "autocomplete",
                    cellEditorFramework: 'AutocompleteAg',
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueAutocompleteSetterInputParams, 'input_params': {} },               
                    cellEditorParams: {
                        return_value: 'work_pattern_code',
                        return_null: true,
                        crud_value: 'id',
                        column_info: [
                            {header: "work_pattern_name", init_width: 150},
                            {header: "max_shifts", init_width: 100},
                            {header: "max_sessions", init_width: 100},
                            {header: "entity_name", init_width: 100},
                            {header: "department_name", init_width: 200},
                            {header: "specialty_name", init_width: 200},
                            {header: "entity_department_specialty_code", init_width: 200},
                            {header: "id" , init_width: 75}
                        ],
                        map_params: {'table_id': table_id_main},
                        map_route: '/data/grids/cfte/work_patterns/maps',
                        return_field: 'work_pattern_id'
                    },
                },

                //workPattern Match need appointment map and work pattern map. check specialties?
                {
                    field: 'specialty_match',
                    width: 200,
                    data_type: "map",
                    editable: false ,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'specialty_match', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': AppointmentWorkPatternMatch, 'input_params': {'display_field': 'specialty_match', 'autocomplete_field': 'work_pattern_code'} },
                    validation: {'function': AppointmentWorkPatternMatchValidation, 'input_params': {'display_field': 'specialty_match', 'autocomplete_field': 'work_pattern_code'} }
                },



                //cfte fiels
                {
                    field: 'effective_date',
                    is_server_field: true,
                    width: 150,
                    data_type: "date",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueDateSetterInputParams, 'input_params': {} }
                },
                //begin shifts
                {
                    field: 'shifts',
                    is_server_field: true,
                    width: 150,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} },
                    validation: {'function': ValidateSS, 'input_params': {'number_ss': 'sessions', 'max_ss': 'max_sessions','display_field': 'time_per_sessions',  'autocomplete_field': 'work_pattern_code'} }

                },
                {
                    field: 'max_shifts',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'max_shifts', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'max_shifts', 'autocomplete_field': 'work_pattern_code'} },
                    valueFormatter: value_formatter.ValueNumberFormatter
                },
                {
                    field: 'shift_alloted_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': ValidateTotalTimeStyle, 'input_params': {'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': TotalTimeSS, 'input_params': {'number_ss': 'shifts','max_ss': 'max_shifts', 'display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'} },
                    //validation between 0 ans shift_max_time
                    validation: {'function': ValidateTotalTimeSS, 'input_params': {'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'} }
                },
                {
                    field: 'shift_max_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field':'time_per_shift', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': MaxTotalTimeSS, 'input_params': {'number_ss': 'max_shifts', 'display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'} },

                },

                //begin sessions
                {
                    field: 'sessions',
                    is_server_field: true,
                    width: 150,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} },
                    validation: {'function': ValidateSS, 'input_params': {'number_ss': 'sessions', 'max_ss': 'max_sessions','display_field': 'time_per_sessions',  'autocomplete_field': 'work_pattern_code'} }

                },
                {
                    field: 'max_sessions',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'max_sessions', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'max_sessions', 'autocomplete_field': 'work_pattern_code'} },
                    valueFormatter: value_formatter.ValueNumberFormatter
                },


                {
                    field: 'sessions_alloted_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': ValidateTotalTimeStyle, 'input_params': {'number_ss': 'sessions', 'max_ss': 'max_sessions','display_field': 'time_per_session',  'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': TotalTimeSS, 'input_params': {'number_ss': 'sessions', 'max_ss': 'max_sessions', 'display_field': 'time_per_session',  'autocomplete_field': 'work_pattern_code'} },
                    //validation between 0 ans shift_max_time
                    validation: {'function': ValidateTotalTimeSS, 'input_params': {'number_ss': 'sessions', 'max_ss': 'max_sessions','display_field': 'time_per_sessions',  'autocomplete_field': 'work_pattern_code'} }
                },

                {
                    field: 'sessions_max_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': MaxTotalTimeSS, 'input_params': {'number_ss': 'max_sessions', 'display_field': 'time_per_session',  'autocomplete_field': 'work_pattern_code'} },

                },

                {
                    field: 'cfte',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': CfteCalculation, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                },


                {
                    field: 'cfte_alloted_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': ValidateCfteAllotedTimeStyle, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': function (input_params) {
                        var time_function = CfteAllotedTotalTime(input_params)
                        return function (params) {
                            var total_time = time_function(params)
                            if (total_time === null ) {return null}
                            else { return String( total_time.toFixed(3) ) }
                        }

                    }, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    validation:{'function': ValidateCfteAllotedTime,'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} }
                },




                {
                    field: 'cfte_max_time',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': function (input_params) {
                        var time_function = CfteMaxTotalTime(input_params)
                        return function (params) {
                            var total_time = time_function(params)
                            if (total_time === null ) {return null}
                            else { return String( total_time.toFixed(3) ) }
                        }

                    }, 'input_params': {'display_field':'time_per_session', 'autocomplete_field': 'work_pattern_code'} }

                },

                {
                    field: 'time_per_shift',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'time_per_shift', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'time_per_shift', 'autocomplete_field': 'work_pattern_code'} },
                    valueFormatter: value_formatter.ValueNumberFormatter
                },

                {
                    field: 'time_per_session',
                    width: 150,
                    data_type: "map",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': value_getter.ValueGetterSetterMapInputParams, 'input_params': {'display_field': 'time_per_session', 'autocomplete_field': 'work_pattern_code'} },
                    valueFormatter: value_formatter.ValueNumberFormatter
                },
                {
                    field: 'npi',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'npi', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'npi', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'classification_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'classification_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'classification_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'cpsc_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cpsc_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cpsc_code', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'cpsc_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cpsc_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cpsc_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'lcg_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'lcg_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'lcg_code', 'autocomplete_field': 'appointment_code'} }
                },



                {
                    field: 'lcg_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'lcg_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'lcg_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'is_active',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'is_active', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'is_active', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'cost_center_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cost_center_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cost_center_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'cost_center_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cost_center_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cost_center_code', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'entity_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'entity_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'entity_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'department_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'department_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'department_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'specialty_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'specialty_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'specialty_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'entity_department_specialty_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'entity_department_specialty_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'entity_department_specialty_code', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'wp_entity_department_specialty_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'wp_entity_department_specialty_code', 'autocomplete_field': 'work_pattern_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'wp_entity_department_specialty_code', 'autocomplete_field': 'work_pattern_code'} }
                },

                {
                    field: 'id',
                    width: 75,
                    data_type: "integer",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} }
                },
                {
                    field: 'last_modified_by_user_email',
                    width: 150,
                    data_type: "string",
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} }
                },
                {
                    headerName: "updated_at",
                    field: "updated_at",
                    data_type: 'datetime',
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} },
                    width: 250,
                    valueFormatter: value_formatter.ValueDateTimeFormatter
                }

            ]
        }
    }
}
//Specialty Check Verification
function AppointmentWorkPatternMatch(input_params) {
// appointment_code
// work_pattern_code
    var appointmentMapFunction = input_params['autocomplete_map']['appointment_code']['mapFunction']
    var workPatternMapFunction = input_params['autocomplete_map']['work_pattern_code']['mapFunction']    
    return function (params) {
        var appointment_ss = value_getter.ValueGetterMap(params, appointmentMapFunction, 'entity_department_specialty_code',
            field_functions.BackupFieldName('entity_department_specialty_code' ),  'appointment_code', 
            field_functions.BackupFieldName('appointment_code' ) )

        var workpattern_ss = value_getter.ValueGetterMap(params, workPatternMapFunction, 'wp_entity_department_specialty_code',
            field_functions.BackupFieldName('wp_entity_department_specialty_code' ),  'work_pattern_code', 
            field_functions.BackupFieldName('work_pattern_code' ) )

        var app_out = ""
        var work_out = ""
        if (appointment_ss === null && workpattern_ss === null) {return null}
        if (appointment_ss !== null) {app_out  = appointment_ss}
        if (workpattern_ss !== null) {work_out = workpattern_ss}
        return app_out + '|'+work_out
    }
}


function AppointmentWorkPatternMatchValidation(input_params) {
// appointment_code
// work_pattern_code
    var appointmentMapFunction = input_params['autocomplete_map']['appointment_code']['mapFunction']
    var workPatternMapFunction = input_params['autocomplete_map']['work_pattern_code']['mapFunction']    
    return function (params) {
        var appointment_ss = value_getter.ValueGetterMap(params, appointmentMapFunction, 'entity_department_specialty_code',
            field_functions.BackupFieldName('entity_department_specialty_code' ),  'appointment_code', 
            field_functions.BackupFieldName('appointment_code' ) )

        var workpattern_ss = value_getter.ValueGetterMap(params, workPatternMapFunction, 'wp_entity_department_specialty_code',
            field_functions.BackupFieldName('wp_entity_department_specialty_code' ),  'work_pattern_code', 
            field_functions.BackupFieldName('work_pattern_code' ) )

        if (appointment_ss === null || workpattern_ss === null) {
            params.data[ input_params['validation_field']] = true
            return true
        }
        if (appointment_ss !== workpattern_ss) {
            params.data[ input_params['validation_field']] = false
            return false
        }
        params.data[ input_params['validation_field']] = true
        return true


    }
}



//Shift Sessions Functions
function TotalTimeSS(input_params) {
    return function (params) {
        var time_per_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['display_field'],
            input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        //get max values for inf/-inf
        var max_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['max_ss'],
            field_functions.BackupFieldName(input_params['max_ss'] ),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var total_time = CalculateTime(params.data[input_params['number_ss'] ], time_per_ss)
        var num_ss = params.data[input_params['number_ss'] ]

        if (total_time === null) {return null}
        if (max_ss === 0) {
            if (num_ss > max_ss) {return 'inf'}
            else if (num_ss < 0) {return '-inf'}
            else {return '0.000'}
        }

        return String( total_time.toFixed(3) )
    }
}

function MaxTotalTimeSS(input_params) {
    return function (params) {

        var time_per_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['display_field'],
            input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var max_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['number_ss'],
            field_functions.BackupFieldName(input_params['number_ss'] ),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var total_time = CalculateTime(max_ss, time_per_ss)
        if (total_time === null) {return null}
        var total_time = total_time.toFixed(3)
        return total_time
    }
}



function CalculateTime(number_ss, time_per_ss) {
    if (number_ss === null ) {return null}
    if (time_per_ss === null) {return null}
    return number_ss*time_per_ss
}

function ValidateTotalTimeSS(input_params) {
    //'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'
    //field_functions.BackupFieldName(fieldname)
    return function (params) {
        var time_per_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['display_field'],
            input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )


        var max_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['max_ss'],
            field_functions.BackupFieldName(input_params['max_ss']),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )


        var total_time = CalculateTime(params.data[input_params['number_ss'] ], time_per_ss)
        var max_time = CalculateTime(max_ss, time_per_ss)

        var ss = params.data[input_params['number_ss'] ]
        if (total_time === null) {return true}
        else if (total_time < 0) {return false}
        else if (max_time === null) {return true}
        else if (total_time > max_time) {return false}
        else if (ss > max_ss) {return false}
        else {return true} 

    }
}

function ValidateSS(input_params) {
    //'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'
    //field_functions.BackupFieldName(fieldname)
    // input_params['mapFunction'] = input_params['autocomplete_map'][input_params[input_params['autocomplete_field']]]
    var autocomplete_lookup = input_params['autocomplete_map'][input_params['autocomplete_field']]
    input_params['mapFunction'] = autocomplete_lookup['mapFunction']
    input_params['return_value'] = autocomplete_lookup['return_value']
    input_params['selectValues'] = autocomplete_lookup['selectValues']
    input_params['autocomplete_backup_field'] = field_functions.BackupFieldName( input_params['autocomplete_field']  )
    input_params['display_field_backup'] = field_functions.BackupFieldName(  input_params['display_field']  )

    return function (params) {
        var ss = params.data[input_params['number_ss'] ]

        var max_ss = value_getter.ValueGetterMap(params, input_params['mapFunction'], input_params['max_ss'],
            field_functions.BackupFieldName(input_params['max_ss']),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var is_valid

        if (ss === null) {is_valid = true}
        else if (ss < 0) {is_valid = false}
        else if (max_ss === null) {is_valid = true}
        else if (ss > max_ss) {is_valid = false}
        else {is_valid = true} 

        params.data[ input_params['validation_field']] = is_valid
        return is_valid
    }
}


function ValidateTotalTimeStyle(input_params) {
    //used for functions that should not be edited.
    // var computedErrVar = {'border-color': 'red', 'border-width':'medium', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var computedPassVar = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var computedWarningVar = {'border-color': 'orange', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var deletedStyle = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'}

    var validationFunction = ValidateTotalTimeSS(input_params)
    return function (params) {
        if (params.data['__is_deleted__'] === true) { return {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'} }
        var is_valid = validationFunction(params)
        if (is_valid) {return {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'} }
        else {
            return {'border-color': 'red', 'border-width':'medium', 'background-color': 'rgba(189, 195, 199, 0.3)'}
        }
    }
}

/*
//CalculateTime pull values?

*/


function CfteMaxTotalTime(input_params) {
    //'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'
    //field_functions.BackupFieldName(input_params['max_ss'])
    return function (params) {
        var time_per_shift = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'time_per_shift',
            field_functions.BackupFieldName('time_per_shift'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )
        var time_per_session = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'time_per_session',
            field_functions.BackupFieldName('time_per_session'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var max_shifts = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'max_shifts',
            field_functions.BackupFieldName('max_shifts'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var max_sessions = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'max_sessions',
            field_functions.BackupFieldName('max_sessions'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        var total_shift_time = CalculateTime(max_shifts, time_per_shift)
        var total_session_time = CalculateTime(max_sessions, time_per_session)
        if (total_shift_time === null || total_session_time === null ) {return null}
        var total_time = total_shift_time + total_session_time
        return total_time
    }
}


function CfteAllotedTotalTime(input_params) {
    //'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'
    //field_functions.BackupFieldName(input_params['max_ss'])
    return function (params) {
        var time_per_shift = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'time_per_shift',
            field_functions.BackupFieldName('time_per_shift'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )
        var time_per_session = value_getter.ValueGetterMap(params, input_params['mapFunction'], 'time_per_session',
            field_functions.BackupFieldName('time_per_session'),  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )


        var total_shift_time = CalculateTime(params.data['shifts'], time_per_shift)
        var total_session_time = CalculateTime(params.data['sessions'], time_per_session)
        if (total_shift_time === null || total_session_time === null ) {return null}
        var total_time = total_shift_time + total_session_time
        return total_time
    }
}

function CfteCalculation(input_params) {
    var alloted_time_fn = CfteAllotedTotalTime(input_params)
    var total_time_fn = CfteMaxTotalTime(input_params)
    //get infinity or negative infinity.
    return function (params) {
        var alloted_time = alloted_time_fn(params)
        var total_time   = total_time_fn(params)
        if (total_time === null) {return null}
        else if (alloted_time === null) {return null}
        else if (total_time === 0) {
            if (alloted_time === 0) {return '0'}
            else {
                if (alloted_time > 0) {return 'inf'}
                else { return '-inf'}
            }
        } 
        var cfte = alloted_time/total_time
        return cfte.toFixed(3)
    }
}



function ValidateCfteAllotedTime(input_params) {
    //'number_ss': 'shifts', 'max_ss': 'max_shifts','display_field': 'time_per_shift',  'autocomplete_field': 'work_pattern_code'
    //field_functions.BackupFieldName(fieldname)
    var alloted_time_fn = CfteAllotedTotalTime(input_params)
    var total_time_fn = CfteMaxTotalTime(input_params)
    return function (params) {
        var alloted_time = alloted_time_fn(params)
        var total_time   = total_time_fn(params)
        if (total_time === null) {return true}
        else if (alloted_time === null) {return true}
        else if (total_time === 0) {
            if (alloted_time === 0) {return true}
            else {return false}
        } 
        else if (alloted_time < 0) {return false}
        else if (alloted_time > total_time) {return false}
        else {return true} 
    }
}

function ValidateCfteAllotedTimeStyle(input_params) {
    //used for functions that should not be edited.
    // var computedErrVar = {'border-color': 'red', 'border-width':'medium', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var computedPassVar = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var computedWarningVar = {'border-color': 'orange', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
    // var deletedStyle = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'}

    var validationFunction = ValidateCfteAllotedTime(input_params)
    return function (params) {
        if (params.data['__is_deleted__'] === true) { return {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'} }
        var is_valid = validationFunction(params)
        if (is_valid) {return {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'} }
        else {
            return {'border-color': 'red', 'border-width':'medium', 'background-color': 'rgba(189, 195, 199, 0.3)'}
        }
    }
}






//WorkPattern and Appointment SpecialtyCode must match?

function IsNull (numx) {
    /*
    This is used to verify the data entered is a number. numx will be used in calculations requiring a number.
    */
    if ( numx === null ) {return true}
    else if ( numx === undefined ) {return true}
    else if (isNaN(numx)) {return true}
    else { return false}
}


</script>