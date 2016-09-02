<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>
<head>
    <!--Force IE not to run in compatibility mode -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta charset="UTF-8">
    <title>CaDSR FormBuilder</title>
	<link rel="stylesheet" href="dist/style.css" />
</head>
<body>

	<h1>CaDSR FormBuilder</h1>
    <div id="app">
	</div>
	<script>
		var formBuilderHost = window.location.host;
		const serverProps = {
			formBuilderHost: '${formBuilderHost}'
		};
		Object.freeze(serverProps);
	</script>
	<script src="dist/bundle.js"></script>

</body>
</html>