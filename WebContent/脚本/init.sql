SELECT * FROM generalsel_head WHERE prog_code LIKE 'RSC2%';
SELECT * FROM generalsel_cri WHERE prog_code LIKE 'RSC2%';
SELECT * FROM generalsel_detail WHERE prog_code LIKE 'RSC2%';

INSERT INTO generalsel_head
  (prog_code, prog_name, fields, prog_name_en, table_name, sub_sys, page_query, db_op, head_width,
   detail_width, subsys_needed, cri_add, fields_ora, cri_add_ora)
  SELECT 'RSC2_' || prog_code, prog_name, fields, prog_name_en, table_name, sub_sys, page_query,
         db_op, head_width, detail_width, subsys_needed, cri_add, fields_ora, cri_add_ora
    FROM generalsel_head
   WHERE prog_code = 'ordDetail1';
INSERT INTO generalsel_cri
  (prog_code, seq_no, field_name, desc_ch, desc_en, width, add_line, ishidden, is_must_input,
   customer_use)
  SELECT 'RSC2_' || prog_code, seq_no, field_name, desc_ch, desc_en, width, add_line, ishidden,
         is_must_input, customer_use
    FROM generalsel_cri
   WHERE prog_code = 'ordDetail1';

INSERT INTO generalsel_detail
  (prog_code, seq_no, field_name, desc_ch, desc_en, width, ishidden, customer_use, suggest_display)
  SELECT 'RSC2_' || prog_code, seq_no, field_name, desc_ch, desc_en, width, ishidden, customer_use,
         suggest_display
    FROM generalsel_detail
   WHERE prog_code = 'ordDetail1';
