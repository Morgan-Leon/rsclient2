package com.rsc.rsclient;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.ParserException;
import com.rsc.rsclient.parse.SuperParser;

/**
 * ������
 * 
 * @author changhu 
 */
public class VariablePool {

	private static Logger logger = Logger.getLogger(VariablePool.class);

	private Map variableMap;

	private VariableCreator variableCreator;
	
	/**
	 * ���췽��
	 */
	public VariablePool() {
		this.variableMap = new HashMap();
		this.variableCreator = new VariableCreator();
	}
	
	/**
	 * ��ȡ��������Set
	 * @return Set
	 */
	public Set variableNameSet(){
		return this.variableMap.keySet();
	}
	
	/**
	 * ��ӱ���
	 * 
	 * @param name ��������
	 * @param value ����ֵ
	 * @return {@link VariableAbstract} ��ӵı�������
	 */
	public VariableAbstract add(String name, Object value) {
		return this.add(name, value.getClass(), value);
	}

	/**
	 * ��ӱ���
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 * @param value ����ֵ
	 * @return {@link VariableAbstract} ��ӵı�������
	 */
	public VariableAbstract add(String name, Class clazz, Object value) {
		VariableAbstract variable = this.variableCreator.createVariable(name, clazz,
				value);
		if (name != null && !"".equals(name)) {
			this.variableMap.put(name, variable);
		}
		return variable;
	}

	/**
	 * ���ݱ������ƻ�ȡ����
	 * 
	 * @param name ��������
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract getVariable(String name) {
		return (VariableAbstract) this.variableMap.get(name);
	}

	/**
	 * ���ݲ�����ֵ��ȡһ�������������ȸ��ݲ�����ֵ�����������󣬲����ñ����������
	 * ���������У�֮�󷵻ظñ�����
	 * 
	 * @param parameter ����
	 * @param value  ֵ
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract getVariable(ParameterAbstract parameter, Object value) {
		return this.add(parameter.getName(), parameter.getClazz(), value);
	}

	/**
	 * ���ݲ�����ȡ�������е�ֵ
	 * 
	 * @param parameters �����б�
	 * @return  object[] ֵ����
	 * @throws Exception
	 */
	public Object[] getValues(List parameters) throws Exception {
		int size = parameters.size();
		Object[] values = new Object[size];
		for (int i = 0; i < size; i++) {
			Parameter parameter = (Parameter) parameters.get(i);
			String name = parameter.getName();
			VariableAbstract variable = this.getVariable(name);
			if (variable != null) {
				values[i] = this.getValue(variable, parameter);
			} else {
				values[i] = null;
			}
		}
		return values;
	}

	/**
	 * ��ȡ����ֵ�����б�Ҫ��������ת����
	 * 
	 * @param variable ����
	 * @param parameter ����
	 * @return
	 */
	public Object getValue(VariableAbstract variable, Parameter parameter) {
		Object value = variable.getValue();
		if(variable.getClazz().isPrimitive()){
			return value;
		}else {
			if (variable.getClazz().isAssignableFrom(parameter.getClazz())) {
				return value;
			} else {
				try {
					return SuperParser.marshal(value, parameter.getClazz());
				} catch (ParserException e) {
					logger.debug(e.getMessage());
					return null;
				}
			}
		}
	}

	/**
	 * ���ر������б�����Ϣ
	 */
	public String toString() {
		StringBuffer sb = new StringBuffer();
		for (Iterator i = this.variableMap.entrySet().iterator(); i.hasNext();) {
			sb.append(i.next() + "\t");
		}
		return sb.toString();
	}
}
