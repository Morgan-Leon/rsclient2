--选择模型
delete from generalsel_head where PROG_CODE='pubModel';
delete from generalsel_cri where PROG_CODE='pubModel';
delete from generalsel_detail where PROG_CODE='pubModel';

insert into generalsel_head (PROG_CODE, PROG_NAME, FIELDS, PROG_NAME_EN, TABLE_NAME, SUB_SYS, PAGE_QUERY, DB_OP, HEAD_WIDTH, DETAIL_WIDTH, SUBSYS_NEEDED, CRI_ADD, PAGE_ROWS, PAGE_WIDTH, PAGE_HEIGHT, CUSTOMER_USE, FIELDS_ORA, CRI_ADD_ORA)
values ('pubModel', '选择数据模型', 'model_code, model_name, table_name, remark', 'select general model', 'generalmodel_head', 'pub', 'pubModel', 'pubModel', '90%', '90%', 'N', null, null, null, null, 'N', 'model_code, model_name, table_name, remark', null);

insert into generalsel_cri (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ADD_LINE, ISHIDDEN, IS_MUST_INPUT, CUSTOMER_USE)
values ('pubModel', 10, 'model_code', '模型编码', null, '16', 'N', 'N', 'N', 'N');

insert into generalsel_cri (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ADD_LINE, ISHIDDEN, IS_MUST_INPUT, CUSTOMER_USE)
values ('pubModel', 20, 'model_name', '模型名称', null, '12', 'N', 'N', 'N', 'N');

insert into generalsel_cri (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ADD_LINE, ISHIDDEN, IS_MUST_INPUT, CUSTOMER_USE)
values ('pubModel', 30, 'table_name', '数据表名', null, '12', 'Y', 'N', 'N', 'N');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModel', 0, 'model_code', '模型编码', 'lot no', '18%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModel', 1, 'model_name', '模型名称', null, '12%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModel', 2, 'table_name', '数据表名', null, '10%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModel', 3, 'remark', '备注', null, '10%', null, 'N', 'Y');

--选择模型字段
delete from generalsel_head where PROG_CODE='pubModelCols';
delete from generalsel_cri where PROG_CODE='pubModelCols';
delete from generalsel_detail where PROG_CODE='pubModelCols';

insert into generalsel_head (PROG_CODE, PROG_NAME, FIELDS, PROG_NAME_EN, TABLE_NAME, SUB_SYS, PAGE_QUERY, DB_OP, HEAD_WIDTH, DETAIL_WIDTH, SUBSYS_NEEDED, CRI_ADD, PAGE_ROWS, PAGE_WIDTH, PAGE_HEIGHT, CUSTOMER_USE, FIELDS_ORA, CRI_ADD_ORA)
values ('pubModelCols', '选择模型数据列', 'column_name, column_comment, data_type, remark', 'select model cols', 'generalmodel_cols', 'pub', 'pubMCols', 'pubMCols', '90%', '90%', 'N', null, null, null, null, 'N', 'column_name, column_comment, data_type, remark', null);

insert into generalsel_cri (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ADD_LINE, ISHIDDEN, IS_MUST_INPUT, CUSTOMER_USE)
values ('pubModelCols', 10, 'column_name', '列名称', null, '16', 'N', 'N', 'N', 'N');

insert into generalsel_cri (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ADD_LINE, ISHIDDEN, IS_MUST_INPUT, CUSTOMER_USE)
values ('pubModelCols', 20, 'column_comment', '列说明', null, '12', 'N', 'N', 'N', 'N');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModelCols', 0, 'column_name', '列名称', 'lot no', '18%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModelCols', 1, 'column_comment', '列说明', null, '12%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModelCols', 2, 'data_type', '数据类型', null, '10%', null, 'N', 'Y');

insert into generalsel_detail (PROG_CODE, SEQ_NO, FIELD_NAME, DESC_CH, DESC_EN, WIDTH, ISHIDDEN, CUSTOMER_USE, SUGGEST_DISPLAY)
values ('pubModelCols', 3, 'remark', '备注', null, '10%', null, 'N', 'Y');

