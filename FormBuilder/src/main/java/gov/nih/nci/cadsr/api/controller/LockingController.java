package gov.nih.nci.cadsr.api.controller;

import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nih.nci.cadsr.FormLock;
import gov.nih.nci.cadsr.authentication.AuthUtils;

@RestController
@RequestMapping(value = "/lock")
public class LockingController {
	
	@Autowired private FormLock lock;
	@Autowired private AuthUtils authUtil;
	
	@RequestMapping(value = "/check/{formIdseq}", method = RequestMethod.GET)
	@ResponseBody
	public boolean checkLock(@PathVariable String formIdseq) {
		
		if(lock.getLockedForms().containsKey(formIdseq)){
			if(!lock.getLockedForms().get(formIdseq).equals(authUtil.getloggedinuser().getUsername())){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	
	@RequestMapping(value = "/set/{formIdseq}", method = RequestMethod.GET)
	@ResponseBody
	public boolean setLock(@PathVariable String formIdseq) {
		
		String username = authUtil.getloggedinuser().getUsername();
		
		if(!lock.getLockedForms().containsKey(formIdseq)){
			lock.getLockedForms().put(formIdseq, username);
			return true;
		}
		else{
			return false;
		}
	}
	
	@RequestMapping(value = "/release/{formIdseq}", method = RequestMethod.GET)
	@ResponseBody
	public boolean releaseLock(@PathVariable String formIdseq) {
		
		String username = authUtil.getloggedinuser().getUsername();
		
		if(lock.getLockedForms().containsKey(formIdseq)){
			if(lock.getLockedForms().get(formIdseq).equals(username)){
				lock.getLockedForms().remove(formIdseq, username);
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
		
	}
	
	@RequestMapping(value = "/showlock", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity showLock(HttpServletRequest request) throws UnknownHostException {
		return new ResponseEntity(lock.getLockedForms(), HttpStatus.OK);
//		return new ResponseEntity(InetAddress.getLocalHost().getHostName() + "|" + request.getRequestURL().toString() + "|" + InetAddress.getLocalHost(), HttpStatus.OK);
//		return authUtil.getloggedinuser();
	}

}
