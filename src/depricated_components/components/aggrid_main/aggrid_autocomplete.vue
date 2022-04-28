<!--
This module is used to create an autocomplete popup window. The user can enter into a cell and type to search
for correct entry value.

selection: stores the value sent from the grid.
previous_value: stores the value sent from the grid as a backup
selectValues: jsonArray [{}] contains all the data available for the autocompelter.
column_info: [ {
    header: column_name
    init_width: number (int, optional)
}]
column_info is used to display the column names and set the column width. if column_name is not in the select values.
    the column wont be displayed. the init_width is an optional parameter. A new value converts the int to a pixel value.
    If information is mising or not an integer. The column width defaults to 200px.  

match_string: default 'match_string'. object name in selectValues used for autocomplete. If the default name match_string is used
    this allows another column name to be used for matching.

create_match_string(bool): default false. Determines if autocomplete should create the match string. This should be done before
    so that the component doesnt have to create the match string on each row every time. 


return_value: name of column to return. If not available, or empty defaults to first column in selectValues.

return_null: default false. If no matching rows available. Autocomplete can return false or the currently entered value.

onCancelReturnPrevious: default true. If cancelled by pressing escape or clicking outside of the grid. Return previous value.


Code for floating table header extended from link below
//http://jsfiddle.net/avrahamcool/eZXtq/
-->
<template>
<div>
    <!-- begin autocomplete widget -->
    <div ref="main" style="position:relative; width: 500px;">
        <input style="width: 100%; height: 100%" type="text" v-model="selection"
            @keydown.enter = 'enter()'
            @keydown.down = 'down'
            @keydown.up = 'up'
            @input = 'change'
             ref="input"
        />
            <!-- begin autocomplete widget -->
            <div style="height: 250px"  @keydown="onKeyDown($event)" tabindex="5">
                <div class="outer-container">
                    <div class="inner-container">
                        <div class="table-header" ref="table-header">
                            <table id="headertable">
                                <thead>
                                    <tr>
                                        <th class="header-cell col1" v-bind:style="{width: col_x.width, maxWidth: col_x.width, minWidth: col_x.width}"  v-for="(col_x, index) in headers" :key="index" >{{col_x.header }}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="table-body" ref='table-body' @scroll="shiftLeft()"
                                    @keydown.enter = 'enter()'
                                    @keydown.down = 'down'
                                    @keydown.up = 'up'                        
                        >
                            <table id="bodytable" ref="bodytable">
                                <tbody ref="tbody"
                                >
                                <tr v-for="(suggestion, index) in matches" :key="index"
                                    v-bind:class="{'active': isActive(index)}"
                                    @mousedown="suggestionClick(index)"
                                    @mousemove="mouseChangeIndex(index)"
                                    style="width: 100%"
                                    ref="rows"
                                >
                                    <td v-bind:style="{width: col_y.width, maxWidth: col_y.width, minWidth: col_y.width}" class="body-cell col1"  
                                        v-for="(col_y, index2) in headers" :key="index2" >
                                            {{suggestion[col_y.header] }}
                                    </td>
                                </tr>



                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end autocomplete widget -->
    </div>


</div>
</template>


<script>

export default {

    data() {
        //all parameters passed through object and stored during create.
        return {
            current: 0, //tracks currently selected row
            lenghtBeforeDropDown: 0, //when rows appear. minimum number of characters.
            selection: '',
            previous_value: '', 
            column_info: null,
            return_value: '', //#default first column
            match_string: '__match_string__',
            create_match_string: false,
            selectValues: null,
            return_null: false,
            onCancelReturnPrevious: false
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            // need to check if the input reference is still valid - if the edit was cancelled before it started there
            // wont be an editor component anymore
            if (this.$refs.input) {
                this.$refs.input.focus();
            }
        })
    },

    created: function() {
        //return value
        //match_key
        //create_match_key (based on headers)
        // selection: '',
        // previous_value: '', 
        // column_info: null,
        // return_value: '', //#default first column
        // selectValues: null,

        // selection: stores the value sent from the grid.
        // previous_value: stores the value sent from the grid as a backup
        // selectValues: jsonArray [{}] contains all the data available for the autocompelter.
        // column_info:
        // match_string:
        // create_match_string(bool): 
        // return_value: name of column to return. If not available, or empty defaults to first column in selectValues.
        // return_null: default false. If no matching rows available. Autocomplete can return false or the currently entered value.
        // onCancelReturnPrevious: default true. If cancelled by pressing escape or clicking outside of the grid. Return previous value.
        // lenghtBeforeDropDown?


        //set initial parameters?
        // console.log(this.params.column_info)
        this.selection = this.params.value
        this.previous_value = this.params.value
        if ('create_match_string' in this.params) { this.create_match_string = this.params.create_match_string }
        if ('match_string' in this.params) { this.match_string = this.params.match_string }
        if ('return_value' in this.params) { this.return_value = this.params.return_value }
        if ('return_null' in this.params) { this.return_null = this.params.return_null }
        if ('onCancelReturnPrevious' in this.params) { this.onCancelReturnPrevious = this.params.onCancelReturnPrevious}
        //backup no autocomplete data loaded.
        if ('column_info' in this.params) {
            this.column_info = this.params.column_info
        } else {
            var column_info = [ {header: 'no_data_sent', init_width: 200 }]
            this.column_info = column_info
        }


        if ('selectValues' in this.params) {
            if (this.params.selectValues.length > 0) { this.selectValues = this.params.selectValues }
            else {
                var noData = [{'no_data_sent':'null'}]
                var column_info = [ {header: 'no_data_sent', init_width: 200 }]
                this.selectValues = noData
                this.column_info = column_info
            }
        } else {
            var noData = [{'no_data_sent':'null'}]
            var column_info = [ {header: 'no_data_sent', init_width: 200 }]
            this.selectValues = noData
            this.column_info = column_info
        }
        if ( this.lengthBeforeDropDown in this.params  ) {
            if (this.params.lenghtBeforeDropDown > 0 ) {
                this.lenghtBeforeDropDown = this.params.lenghtBeforeDropDown
            }
        }
        //lengthBeforeDropDown.
        if (this.create_match_string || !(this.selectValues[0].hasOwnProperty(this.match_string) ) ) {
            var match_string = ''
            var i;
            var objx
            var k;
            for (i in  this.selectValues) {
                objx = this.selectValues[i]
                match_string = ''
                for (k in objx ) {
                    match_string += String(objx[k]).toLowerCase()
                }
                // console.log(match_string)
                match_string = match_string.replace(/\s/g, '')
                objx[this.match_string] = match_string 
            }
        }
        //set column widths
        var i = 0;
        var tmpNum;
        for (i in this.column_info) {
            if ('init_width' in this.column_info[i]) {
                tmpNum = this.column_info[i]['init_width']
                if (Number.isInteger(tmpNum) ) {
                    if (tmpNum >= 50) {
                        this.column_info[i]['width'] = this.column_info[i]['init_width'].toString() +'px'
                    } else {
                        this.column_info[i]['width'] = '200px'
                    }

                } else { this.column_info[i]['width'] = '200px' }  
            } else {this.column_info[i]['width'] = '200px'}
        }
        // console.log(this.column_info)
    },

    // mounted: function () {
    //     console.log(this.headers)
    // },
    computed: {
        matches() {
            if (this.selection == "" || this.selection === null  ) {

                return this.selectValues 
            }
            else {
                var mx = String(this.selection).toLowerCase()
                var mx_array = mx.split(/[\s,]+/)
                return this.selectValues.filter((row) => {
                    var match_string = row[this.match_string]
                    var i = 0;
                    for( i in mx_array) {
                        if (match_string.indexOf(mx_array[i]) < 0) {return false}
                    }
                    return true
                });
            }

        },

        headers() {
            //if select values > 0
            //if header in select values??
            return this.column_info
            // return Object.keys(this.selectValues[0])
        }


    },

    methods: {
        onKeyDown(event) {
            //blah
            var inputElement = this.$refs['input']
            var activeElement = document.activeElement
            if (inputElement === activeElement) {
                //console.log('same element')
                return
            } else {
                if (this.$refs.input) {
                   this.$refs.input.focus();
                    //key code
                    // console.log(event.code)
                    if (event.code == 'Enter') { //pressed enter
                        this.enter()
                    } else if (event.code == 'ArrowUp') { //pressed up
                        this.up()
                    } else if (event.code == 'ArrowDown') { //pressed down
                        this.down()
                    }

                }
            }
        },
        setMainContainerStyle () {
            //used to set main container style. based on min and max of stuff??
        },

        enter() {
            var matchLen = this.matches.length
            if (this.current >=0 && matchLen > 0 && ( this.current < matchLen )) {
                this.selection = this.matches[this.current][this.return_value];
                this.params.stopEditing()
            } else {
                // this.selection = null
                if (this.return_null===true) {this.selection = null}

                this.params.stopEditing()
            }
        },

        up() {
            // console.log(this.current)
            if(this.current > 0) {this.current--;}
            this.fixScroll(0)
        },

        down() {
            if(this.current < this.matches.length - 1) {this.current++;}
            this.fixScroll(1)
            
        },
        isPopup () {
            return true
        },
        getValue() {
            return this.selection;
        },
        isActive(index) {
            return index === this.current;
        },
        //onCancel?

        change() {
            this.current = 0;
        },
        suggestionClick(index) {
            this.selection = this.matches[index][this.return_value];
            this.params.stopEditing()
        },
        mouseChangeIndex(index) {
            this.current = index
        },
        fixScroll(dup) {
            var el =this.$refs.rows[this.current]
            var row = el
            var rect = el.getBoundingClientRect()
            var rect1 = el.parentNode.getBoundingClientRect()
            var rect2 = this.$refs['table-body'].getBoundingClientRect()
            // console.log(el.parentNode)
            // console.log( rect2.top,rect2.bottom,  rect.top, rect.bottom)
            // console.log((rect.top+1) - rect2.top)
            if ( (rect.top+10) - rect2.top < 0 ) {
                row.scrollIntoView()
            } else if ( (rect.bottom+1) > rect2.bottom ) {
                row.scrollIntoView(false)
            }
        },
        shiftLeft() {
            // console.log('hi')
            var tableBodyScroll = this.$refs['table-body']
            var tableHeader = this.$refs['table-header']
            try {
                var tableBodyScrollLeft = tableBodyScroll.scrollLeft 
                tableHeader.style.left = -1*tableBodyScrollLeft + "px"
            }
            catch (e) {}
        }
    }
}

</script>

<style scoped>
*
{
    padding: 0;
    margin: 0;
    /*-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;*/
}

body
{
    height: 100%;
    width: 100%;
}
table
{
    border-collapse: collapse; /* make simple 1px lines borders if border defined */
}
/* table::after {
    clear: both;
} */

.outer-container
{
    /* background-color: #ccc; */
    position: absolute;
    /* top: 0px;
    left: 0px; */
    /* right: 300px;
    bottom: 40px; */
    max-width:  500px;
    max-height: 300px;
}

.inner-container
{
    height: 100%;
    overflow: hidden;
}

.table-header
{
    height: 40px;
    position: relative;
}
.table-body
{
    /* height: calc(100% - 40px); */
    max-height: 200px;
    overflow: auto;
}

.header-cell
{
    /* background-color: yellow; */
    background-color:	#DCDCDC;
    text-align: left;
    height: 40px;

}
.body-cell 
{
    /* background-color: blue; */
    text-align: left;
}

/* .col1
{
    width: 200px;
    min-width: 200px;
} */

/* overflow hidden */
td
{
 /* max-width: 200px; */
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
}

th
{
 /* max-width: 200px; */
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
}


.active {
    background-color: cyan;
}

</style>