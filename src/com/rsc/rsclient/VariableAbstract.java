package com.rsc.rsclient;

/**
 * 抽象变量类，用于对执行业务方法的变量的封装。该类的子类有{@link Variable}
 * 
 * @author changhu
 */
public abstract class VariableAbstract {

	public String name;

	private Class clazz;

	private Object value;
	
	/**
	 * 构造方法。
	 *
	 * @param name 变量名称
	 * @param clazz 变量类型
	 */
	public VariableAbstract(String name, Class clazz) {
		this.setName(name);
		this.setClazz(clazz);
	}
	
	/**
	 * 构造方法。
	 *
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @param value 变量值
	 */
	public VariableAbstract(String name, Class clazz, Object value) {
		this.setName(name);
		this.setClazz(clazz);
		this.setValue(value);
	}

	/**
	 * 获取变量名称
	 * 
	 * @return {@link String} 变量名称
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * 设置变量名称
	 * 
	 * @param name 变量名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 获取变量类型
	 * 
	 * @return {@link Class} 变量类型
	 */
	public Class getClazz() {
		return this.clazz;
	}

	/**
	 * 设置变量类型
	 * 
	 * @param clazz 变量类型
	 */
	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}

	/**
	 * 设置变量值
	 * 
	 * @param value 变量值
	 */
	public void setValue(Object value) {
		this.value = value;
	}

	/**
	 * 获取变量值
	 * 
	 * @return {@link Object} value
	 */
	public Object getValue() {
		return this.value;
	}

	/**
	 * 获取变量文本值
	 * 
	 * @return {@link String} 变量文本值
	 */
	public String getValueText() {
		if (this.getValue() == null) {
			return null;
		}
		return this.getValue().toString();
	}

	/**
	 * 获取变量字符串值和{@link Variable#getValueText()}没有区别。
	 * 
	 * @return {@link String} 变量字符串值
	 */
	public String getStringValue() {
		return this.getValueText();
	}

	/**
	 * 获取变量char值，如果变量文本值长度大于1，返回第一个字符，
	 * 如果变量值为null，返回0
	 * 
	 * @return char 
	 */
	public char getCharacterValue() {
		if (this.getValueText() == null) {
			return 0;
		}
		return new Character(this.getValueText().charAt(0)).charValue();
	}

	/**
	 * 获取变量byte值，如果变量值为null 返回0
	 * 
	 * @return byte
	 */
	public byte getByteValue() {
		if (this.getValueText() == null) {
			return 0;
		}
		return new Byte(this.getValueText()).byteValue();
	}

	/**
	 * 获取变量boolean值，如果变量值为null，返回false。
	 * 
	 * @return boolean 
	 */
	public boolean getBooleanValue() {
		if (this.getValue() == null) {
			return false;
		}
		return new Boolean(this.getValueText()).booleanValue();
	}

	/**
	 * 获取变量short值，如果变量值为null，返回0
	 * 
	 * @return short 
	 */
	public short getShortValue() {
		if (this.getValue() == null) {
			return 0;
		}
		return new Short(this.getValueText()).shortValue();
	}

	/**
	 * 获取变量int值，如果变量值为null，返回0
	 * 
	 * @return int
	 */
	public int getIntegerValue() {
		if(this.getValue() == null){
			return 0;
		}
		return new Integer(this.getValueText()).intValue();
	}

	/**
	 * 获取变量long值，如果变量值为null，返回0
	 * 
	 * @return long
	 */
	public long getLongValue() {
		if (this.getValue() == null) {
			return 0;
		}
		return new Long(this.getValueText()).longValue();
	}

	/**
	 * 获取变量float值，如果变量值为null，返回0
	 * 
	 * @return
	 */
	public float getFloatValue() {
		if (this.getValue() == null) {
			return 0;
		}
		return new Float(this.getValueText()).floatValue();
	}

	/**
	 * 获取变量double值，如果变量值为null，返回0
	 * 
	 * @return double
	 */
	public double getDoubleValue() {
		if (this.getValue() == null) {
			return 0;
		}
		return new Double(this.getValueText()).doubleValue();
	}

	/**
	 * 返回变量信息，如name,clazz和value
	 * 
	 * @return {@link String}
	 */
	public String toString() {
		return "name:" + this.getName() + " clazz:" + this.getClazz()
				+ " value:" + this.getValueText();
	}
}
