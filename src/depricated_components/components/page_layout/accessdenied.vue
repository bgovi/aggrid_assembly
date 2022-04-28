<!--
page is generated if access denied.

-->
<template>
    <p style="text-align: center; padding-top: 20px;">No Read Permissions for {{table_name}}. Please request permissions or contact CBIA at IUHPCBIA@iuhealth.org</p>
</template>

<script>
export default {
    props: {
        table_name: {
            type: String
        }
    }
    
}
</script>