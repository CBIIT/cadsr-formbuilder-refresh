<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>
<head>
    <!--Force IE not to run in compatibility mode -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta charset="UTF-8">
    <title>CaDSR FormBuilder</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="dist/style.css" />
	<link href="https://fonts.googleapis.com/css?family=Montserrat|Noto+Sans:400,700" rel="stylesheet"/>
	<script src="https://use.fontawesome.com/4459b88325.js"></script>
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
		
		const externalDomains = {
			cdeBrowser: "<spring:eval expression="@propertyConfigurer['link.cde.browser']" />",
			cdeCurate: "<spring:eval expression="@propertyConfigurer['link.curation.tool']" />",
			cadsrsentinel: "<spring:eval expression="@propertyConfigurer['link.sentinel.tool']" />",
			cadsradmintool: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			
			metaThesaurus: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			terminology: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			help: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			feedback: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			contact: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			about: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />",
			privacy: "<spring:eval expression="@propertyConfigurer['link.admin.tool']" />"
		};
		Object.freeze(externalDomains);
	</script>

<script src="dist/bundle.js"></script>


</body>
</html>