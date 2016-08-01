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
	<h2>Test Property Injection:</h2>
	<div>
		<p>
			<spring:eval expression="@applicationProperties.getProperty('test.value')" />
		</p>
	</div>
    <div id="app">
	</div>
	<script>
		const serverProps = {
			/*TODO inject value from properties file */
			searchEndPoint: 'http://localhost:8080/FormService/api/v1/legacy/forms'
		};
		Object.freeze(serverProps);
	</script>
	<script src="dist/bundle.js"></script>

</body>
</html>