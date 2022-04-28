<!--
Displays helpful information about each filter. It accepts three strings as props that
are displayed as html

data_type: the type of data in the filter i.e. date, string, integer, float
filter_description: the filter type used and how it sends the data to the server i.e. how data_filter is used
data_description: meaning of the data unit to be modified.
-->
<template>
    <div style="border-top: 2px dotted; max-width: 100%; word-wrap: break-word;">
        <div style="margin-left: 5px;">
            <h5 style="display: inline;">Data Description:</h5>
            <p style="display: inline; font-size: 13px;"><span v-html="data_description"></span></p>
            <div></div>

            <h5 style="display: inline;">Filter Description:</h5>
            <p style="display: inline; font-size: 13px;"><span v-html="filter_description"></span></p>
            <div></div>

            <h5 style="display: inline;">Data Type:</h5>
            <p style="display: inline; font-size: 13px;"><span v-html="data_type"></span></p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data_type: {
            type: String,
            required: true
        },

        filter_description: {
            type: String,
            required: true
        },
        data_description: {
            type: String,
            required: true
        },
    }
}
</script>