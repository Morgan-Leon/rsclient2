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
 * 变量池
 * 
 * @author changhu 
 */
public class VariablePool {

	private static Logger logger = Logger.getLogger(VariablePool.class);

	private Map variableMap;

	private VariableCreator variableCreator;
	
	/**
	 * 构造方法
	 */
	public VariablePool() {
		this.variableMap = new HashMap();
		this.variableCreator = new VariableCreator();
	}
	
	/**
	 * 获取变量名称Set
	 * @return Set
	 */
	public Set variableNameSet(){
		return this.variableMap.keySet();
	}
	
	/**
	 * 添加变量
	 * 
	 * @param name 变量名称
	 * @param value 变量值
	 * @return {@link VariableAbstract} 添加的变量对象
	 */
	public VariableAbstract add(String name, Object value) {
		return this.add(name, value.getClass(), value);
	}

	/**
	 * 添加变量
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @param value 变量值
	 * @return {@link VariableAbstract} 添加的变量对象
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
	 * 根据变量名称获取变量
	 * 
	 * @param name 变量名称
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract getVariable(String name) {
		return (VariableAbstract) this.variableMap.get(name);
	}

	/**
	 * 根据参数和值获取一个变量对象，首先根据参数和值创建变量对象，并将该变量对象添加
	 * 到变量池中，之后返回该变量。
	 * 
	 * @param parameter 参数
	 * @param value  值
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract getVariable(ParameterAbstract parameter, Object value) {
		return this.add(parameter.getName(), parameter.getClazz(), value);
	}

	/**
	 * 根据参数获取变量池中的值
	 * 
	 * @param parameters 参数列表
	 * @return  object[] 值数组
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
	 * 获取变量值，如有必要进行类型转换。
	 * 
	 * @param variable 变量
	 * @param parameter 参数
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
	 * 返回变量池中变量信息
	 */
	public String toString() {
		StringBuffer sb = new StringBuffer();
		for (Iterator i = this.variableMap.entrySet().iterator(); i.hasNext();) {
			sb.append(i.next() + "\t");
		}
		return sb.toString();
	}
}
