<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html> 
<head>
    <!--Force IE not to run in compatibility mode -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>CaDSR FormBuilder</title>
</head>
<body>

	<h1>CaDSR FormBuilder</h1>
	<div>
		<p>
			<spring:eval expression="@propertyConfigurer.getProperty('formbuilder.api.url')" var="formBuilderHost" />
		</p>
	</div>
    <div id="app">
	</div>
	<script>
		const serverProps = {
			searchEndPointUrl: '${formBuilderHost}/FormBuilder/api/v1/forms'
		};
		Object.freeze(serverProps);
	</script>
	<script src="dist/bundle.js"></script>

</body>
</html>