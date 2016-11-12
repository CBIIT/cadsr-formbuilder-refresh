package gov.nih.nci.cadsr.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.ProtocolTrDao;
import gov.nih.nci.cadsr.manager.ProtocolManager;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ProtocolDAO;

@Service
public class ProtocolManagerImpl implements ProtocolManager {

	@Autowired
	private ProtocolTrDao protocolTrDao;
	@Autowired
	AbstractDAOFactoryFB daoFactory;

	@Override
	public List<ProtocolTransferObject> getProtocol(String KeyWord) {
		return protocolTrDao.getProtocol(KeyWord);
	}

	@Override
	public ProtocolTransferObject getProtocolByPK(String protocoldIdseq) {
		ProtocolDAO dao = daoFactory.getProtocolDAO();
		return (ProtocolTransferObject) dao.getProtocolByPK(protocoldIdseq);
	}

}