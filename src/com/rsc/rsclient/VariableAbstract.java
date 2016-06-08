package com.rsc.rsclient;

/**
 * ��������࣬���ڶ�ִ��ҵ�񷽷��ı����ķ�װ�������������{@link Variable}
 * 
 * @author changhu
 */
public abstract class VariableAbstract {

	public String name;

	private Class clazz;

	private Object value;
	
	/**
	 * ���췽����
	 *
	 * @param name ��������
	 * @param clazz ��������
	 */
	public VariableAbstract(String name, Class clazz) {
		this.setName(name);
		this.setClazz(clazz);
	}
	
	/**
	 * ���췽����
	 *
	 * @param name ��������
	 * @param clazz ��������
	 * @param value ����ֵ
	 */
	public VariableAbstract(String name, Class clazz, Object value) {
		this.setName(name);
		this.setClazz(clazz);
		this.setValue(value);
	}

	/**
	 * ��ȡ��������
	 * 
	 * @return {@link String} ��������
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * ���ñ�������
	 * 
	 * @param name ��������
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * ��ȡ��������
	 * 
	 * @return {@link Class} ��������
	 */
	public Class getClazz() {
		return this.clazz;
	}

	/**
	 * ���ñ�������
	 * 
	 * @param clazz ��������
	 */
	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}

	/**
	 * ���ñ���ֵ
	 * 
	 * @param value ����ֵ
	 */
	public void setValue(Object value) {
		this.value = value;
	}

	/**
	 * ��ȡ����ֵ
	 * 
	 * @return {@link Object} value
	 */
	public Object getValue() {
		return this.value;
	}

	/**
	 * ��ȡ�����ı�ֵ
	 * 
	 * @return {@link String} �����ı�ֵ
	 */
	public String getValueText() {
		if (this.getValue() == null) {
			return null;
		}
		return this.getValue().toString();
	}

	/**
	 * ��ȡ�����ַ���ֵ��{@link Variable#getValueText()}û������
	 * 
	 * @return {@link String} �����ַ���ֵ
	 */
	public String getStringValue() {
		return this.getValueText();
	}

	/**
	 * ��ȡ����charֵ����������ı�ֵ���ȴ���1�����ص�һ���ַ���
	 * �������ֵΪnull������0
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
	 * ��ȡ����byteֵ���������ֵΪnull ����0
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
	 * ��ȡ����booleanֵ���������ֵΪnull������false��
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
	 * ��ȡ����shortֵ���������ֵΪnull������0
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
	 * ��ȡ����intֵ���������ֵΪnull������0
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
	 * ��ȡ����longֵ���������ֵΪnull������0
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
	 * ��ȡ����floatֵ���������ֵΪnull������0
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
	 * ��ȡ����doubleֵ���������ֵΪnull������0
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
	 * ���ر�����Ϣ����name,clazz��value
	 * 
	 * @return {@link String}
	 */
	public String toString() {
		return "name:" + this.getName() + " clazz:" + this.getClazz()
				+ " value:" + this.getValueText();
	}
}
