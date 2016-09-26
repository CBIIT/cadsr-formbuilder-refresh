<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>
<head>
    <!--Force IE not to run in compatibility mode -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta charset="UTF-8">
    <title>CaDSR FormBuilder</title>
	<link rel="stylesheet" href="dist/style.css" />
	<link href="https://fonts.googleapis.com/css?family=Montserrat|Noto+Sans" rel="stylesheet">

</head>
<body>

<%--TODO accessible main heading with proper wording--%>
	<h1 class="sr-only">NCI CaDSR FormBuilder</h1>
    <div id="app">
	</div>
	<script>
		var formBuilderHost = window.location.host;
		const serverProps = {
			formBuilderHost: '${formBuilderHost}'
		};
		Object.freeze(serverProps);
	</script>

<script src="dist/bundle.js
"></script>


</body>
</html>