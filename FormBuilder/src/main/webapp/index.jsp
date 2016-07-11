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

	<h1>Hello World!</h1>
	<h2>Test Property Injection:</h2>
	<div>
		<p>
			<spring:eval expression="@applicationProperties.getProperty('test.value')" />
		</p>
	</div>
	<script src="dist/bundle.js"></script>

</body>
</html>