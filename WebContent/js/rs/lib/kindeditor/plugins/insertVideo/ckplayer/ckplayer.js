/*
˵����
ckplayer6.0,�����������http://www.ckplayer.com
��ע�⣬���ļ�ΪUTF-8���룬����Ҫ�ı���뼴��ʹ���ڸ��ֱ�����ʽ����վ��
=======================================================================
��һ���֣����ز��
����Ϊ���صĲ������
��������ò���˵����
    1���������
    2��ˮƽ���뷽ʽ��0��1�У�2�ң�
    3����ֱ���뷽ʽ��0�ϣ�1�У�2�£�
    4��ˮƽ����λ��ƫ����
    5����ֱ����λ��ƫ����
    6������ĵȼ�+����
    ������ƾ�����Ҫ��ͬ���Դ˵���ϸ˵���뵽��վ�鿴
*/
function ckcpt(){
    var cpt = "";
    cpt += 'sch_lf.png,0,2,15,-37,0|';//��������ߵ���Բ�ǵ�СͼƬ
    cpt += 'sch_lr.png,2,2,-16,-37,0|';//�������ұ���Բ�ǵ�СͼƬ
    cpt += 'right.swf,2,1,-75,-100,2|';//�߿��صƵ����Ĳ��
    cpt += 'share.swf,1,1,-180,-100,3|';//������
    cpt += 'adjustment.swf,1,1,-180,-100,3|';//������С����ɫ�Ĳ��
    return cpt;
}
/*
����Ķ������
�����Ƕ����ܵķ���Լ��Բ��������ܽ�������
*/
function ckstyle() { //�����ܵķ��
    var ck = new Object();
    ck.cpath='/kindeditor/plugins/insertVideo/ckplayer/assets/';
    /*�������ļ���·����Ĭ�ϵ���ckplyaer/assets/��������ò����������������óɾ���·�����ԣ�����ֻ��Ҫ����һ��·�����ɣ������ͼƬ�Ͳ����·�����Զ������·��Ϊ׼�������֪��·������ʹ�õ���Ĭ�����ã�����ֱ�����գ����������Զ�Ѱ��*/
    ck.mylogo='logo.swf';
    /*��Ƶ����ǰ��ʾ��logo�ļ�����ʹ�����ó�null*/
    ck.logo='cklogo.png';
    /*һֱ��ʾ��logo����ʹ�����ó�null*/
    ck.buffer='buffer.swf';
    /*����ʱ��ʾ��ͼ�꣬��ʹ�����ó�null*/
    ck.controlbar='images_buttom_bg.png';
    /*����������ͼƬ*/
    ck.cplay='images_Play_out.png,images_Play_on.png';
    /*
    ���Ű�ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.cpause='images_Pause_out.png,images_Pause_on.png';
    /*
    ��ͣ��ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.pausec='images_Pause_Scgedyke.png,images_Pause_Scgedyke_on.png';
    /*
    �������м���ͣ��ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.sound='images_Sound_out.png,images_Sound_on.png';
    /*
    ������ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.mute='images_Mute_out.png,images_Mute_on.png';
    /*
    ȡ��������ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.full='images_Full_out.png,images_Full_on.png';
    /*
    ȫ����ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.general='images_General_out.png,images_General_on.png';
    /*
    ȡ��ȫ����ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.cvolume='images_Volume_back.png,images_Volume_on.png,images_Volume_Float.png,images_Volume_Float_on.png';
    /*
    �������ڿ���ĸ�ͼƬ
        1�����ڿ�ı���ͼƬ(��ʾ����������1-100)
        2�����ڿ��ǰ��ͼƬ(��ʾ��ǰ������)
        3���϶���ť��ͨ״̬�µ�ͼƬ
        4���϶���ť��꾭��ʱ��ͼƬ
    */
    ck.schedule='images_Schedule_bg.png,images_Schedule_load.png,images_Schedule_play.png,images_Schedule.png,images_Schedule_on.png';
    /*
    �����������ͼƬ
        1������������ͼƬ
        2���Ѽ��ؽ���ͼƬ
        3���Ѳ��Ž���ͼƬ
        4���϶���ť��ͨ״̬�µ�ͼƬ
        5���϶���ť��꾭��ʱ��ͼƬ
    */
    ck.fast='images_Fashf_out.png,images_Fashf_on.png,images_Fashr_out.png,images_Fashr_on.png';
    /*
    ����Ϳ��˰�ťͼƬ
        1�������ť��ͨ״̬�µ�ͼƬ
        2�������ť��꾭��ʱ��ͼƬ
        3�����˰�ť��ͨ״̬�µ�ͼƬ
        4�����˰�ť��꾭��ʱ��ͼƬ
    */
    ck.advmute='images_v_off_out.png,images_v_off_on.png,images_v_on_out.png,images_v_on_on.png';
    /*
    ǰ�ù��ʱ������ť���ĸ�ͼƬ
        1��������ť��ͨ״̬�µ�ͼƬ
        2��������ť��꾭��ʱ��ͼƬ
        3��ȡ��������ť��ͨ״̬�µ�ͼƬ
        4��ȡ��������ť��꾭��ʱ��ͼ
    */
    ck.advjump='images_adv_skip_out.png,images_adv_skip_on.png';
    /*
    ǰ�ù��ʱ·����ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.advclose='images_close_adv_out.png,images_close_adv_on.png';
    /*
    �رչ������ֹ�水ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    ck.padvclose='pause_adv_close_out.png,pause_adv_close_on.png';
    /*
    �ر���ͣ��水ť�Ķ���ͼƬ
        1����ͨ״̬�µ�ͼƬ
        2����꾭��ʱ��ͼƬ
    */
    /*�����ǲ������õ��İ�ť�Ϳ�������ͼƬ�������Լ�����ͼƬ��ʽ�����꣬�����ڱ��ĵ�������*/
    /*�����ǲ������Դ��Ķ������*/
    ck.control_rel='related.swf,ckplayer/related.xml,0';
    /*��Ƶ���Ž�������ʾ�����Ƶ�Ĳ���ļ���ע�⣬��Ƶ�����������ó�3ʱ��Ч����xml�ļ��������ļ������Զ����ļ����ͣ�����asp,php,jsp,.netֻҪ�������xml��ʽ���У�������0��Ĭ�ϵ�utf-8,1��gbk2312*/
    ck.control_pv='Preview.swf,105,2000';
    /*
    ��ƵԤ�����
        1������ļ�����
        2����������ĸ�(ָ���ǲ���Ķ������������λ��)
        3���ӳ�ʱ��(�ô�������꾭��������ͣ�ٶ��ٺ�������ʾ���)
    */
    ck.setup='1,1,1,0,1,1,0,1,0,0,1,1,200,0,1,1,0,1,1,1,2,10,3';
    /*
    �������ã�
        1����꾭����ť�Ƿ�ʹ�����ͣ�0��ͨ��꣬1�������
            2���Ƿ�֧�ֵ�����ͣ��0��֧�֣�1��֧��
            3���Ƿ�֧��˫��ȫ����0��֧�֣�1��֧��
            4���ڲ���ǰ�ù��ʱ�Ƿ�ͬʱ������Ƶ��0�����أ�1����
            5�������ʾ�Ĳο�����0�ǲο���Ƶ����1�ǲο�����������
            6������С�ĵ�����ʽ,ֻ���swf��ͼƬ��Ч,��Ƶ���Զ����ŵ�
                =0���Զ�������С����˼��˵��Ļ��ͱ�С��С�Ļ��ͱ��
                =1�Ǵ�Ļ���С��С�Ļ�����
                =2��ʲôҲ���䣬����ô��
                =3�Ǹ��ο�����(��5������)�������õ�һ�����
            7��ǰ�ù�沥��˳��0��˳�򲥷ţ�1���������
            8��������Ƶ����Ƿ����������0�ǲ�ʹ�ã�1��ʹ�ã������1�����û���������������»ᰴ�趨�ĵ���ʱ���в��Ź�棬��ʱ���������Ƭ���Ƚ����Ի��������ó�0�Ļ�����ǿ�Ʋ���������ܲ�����Ƭ
            9���Ƿ����������ֹ�棬0�ǲ�������1�ǿ����Ҳ�ʹ�ùرհ�ť��2�ǿ�������ʹ�ùرհ�ť���������ڼ�����Ƶ��ʱ����ع������ֹ��
            10����Ƶ�ĵ�����ʽ
                =0���Զ�������С����˼��˵��Ļ��ͱ�С��С�Ļ��ͱ��ͬʱ���ֳ����������
                =1�Ǵ�Ļ���С��С�Ļ�����
                =2��ʲôҲ���䣬����ô��
                =3�Ǹ��ο�����(pm_video������)�������õ�һ�����
            11���Ƿ��ڶ���Ƶʱ�ֶμ��أ�0���ǣ�1��
            12��������Ƶʱ�Ƿ����ƽ������0���ǣ�1��
            13����Ƶ����ʱ��,��λ������,���鲻����300
            14����ʼͼƬ������ʽ(
                =0���Զ�������С����˼��˵��Ļ��ͱ�С��С�Ļ��ͱ��ͬʱ���ֳ����������
                =1�Ǵ�Ļ���С��С�Ļ�����
                =2��ʲôҲ���䣬����ô��
                =3�Ǹ�pm_video�������õ�һ�����
            15����ͣ��������ʽ(
                =0���Զ�������С����˼��˵��Ļ��ͱ�С��С�Ļ��ͱ��ͬʱ���ֳ����������
                =1�Ǵ�Ļ���С��С�Ļ�����
                =2��ʲôҲ���䣬����ô��
                =3�Ǹ�pm_video�������õ�һ����
            16����ͣ����Ƿ�ʹ�ùرչ�����ã�0��ʹ�ã�1ʹ��
            17������ʱ�Ƿ񲥷Ź�棬0�ǲ���ʾ��1����ʾ��ͬʱ���ص�����ͼ��ͽ��ȣ�2����ʾ�������ػ���ͼ��
            18���Ƿ�֧�ּ��̿ո�����Ʋ��ź���ͣ0��֧�֣�1֧��
            19���Ƿ�֧�ּ������ҷ�������ƿ������0��֧�֣�1֧��
            20���Ƿ�֧�ּ������·������������0��֧�֣�1֧��
            21������������js���������ĵȼ���0-2,�ȼ�Խ�ߣ����صĲ���Խ��
                0�ǲ������κβ���
                1���ز������ڲ��ŵ�ʱ��Ĳ����������ع��֮��Ĳ���
                2����ȫ������
                3����ȫ�������������ڲ���ǰ����"������ID->"�����ڶಥ�����ļ���
            22������Ϳ��˵�����
            23��������ͼƬԪ�ؼ���ʧ�����¼��ش���
    */
    ck.pm_repc='';
    /*��Ƶ��ַ�滻�����ù�����Ҫ���������򵥼��ܵĹ��ܣ�ʹ�÷����ܼ򵥣��뵽��վ�鿴*/
    ck.pm_spac='|';
    /*��Ƶ��ַ�������������Ҫ�ǲ��Ŷ����Ƶʱʹ����ͨ���÷�ʽ����ַ���÷�ʽʱʹ�õġ�Ĭ��ʹ��|�������Ƶ��ַ�ﱾ�����|�Ļ���Ҫ��������һ���������ע�⣬��ʹֻ��һ����ƵҲ��Ҫ����*/
    ck.pm_logo='2,0,-100,20';
    /*
    һֱ��ʾ�ڲ������ϵ�logo������
    ��������е��ĸ�������������ķ�ʽȫ������ͳһ����˼������
        0��ˮƽ���뷽ʽ��0����1���У�2���ң�-1������
        1����ֱ���뷽ʽ��0���ϣ�1���У�2���£�-1������
        3��ˮƽƫ����������˵���������1���������ó�0����룬��3��ƫ�������ó�10�����������10�����أ����ó�-10����ť�ͻ��ܵ�����������
        4����ֱƫ����
    */
    ck.pm_mylogo='1,1,-100,-55';
    /*��Ƶ����ǰ��ʾ��logo�ļ�(mylogo������)������*/
    ck.pm_advtime='2,0,-110,10,0,300,0';
    /*ǰ�ù�浹��ʱ�ı�����*/
    ck.pm_advstatus='1,2,2,-200,-40';
    /*ǰ�ù�澲����ť
        1���Ƿ���ʾ0����ʾ��1��ʾ
        2,3,4,5����
    */
    ck.pm_advjp='1,1,2,2,-100,-40';
    /*ǰ�ù��������水ť,
        1���Ƿ���ʾ0����ʾ��1����ʾ
        2��������ť��������(ֵ0/1,0��ֱ����ת,1�Ǵ���js:function ckadjump(){})
        3,4,5,6���������
    */
    ck.pm_load='1,1,-50,10,1,100,0';
    /*
    ��ʾ������Ƶ�ٷֱȵ��ı���
        1��2��3��4������
        5���ı����뷽ʽ��0������룬1���м���룬2���Ҷ��룬3��Ĭ�϶��루�൱������룩
        6���ı���Ŀ�ֻ������/�Ҷ���ʱ��Ч
        7���ı���ĸ�
        �ر�˵���������й����ı��Ŀ����У�ֻ�����������Ҷ��룬����Ŀ�ȲŻ���Ч����������õ��м���룬������Ч��
    */
    ck.pm_buffer='1,1,-20,-35';
    /*����ʱ��ʾ��ͼ��(bufferͼ��)������*/
    ck.pm_buffertext='1,1,-13,-25,0,40,0';
    /*�����ı���(��ʾ���ذٷֱ�)������*/
    ck.pm_ctbar='1,2,0,-30,0,30,0,1,5000';
    /*
    �������Ĳ���(�������͹������ֹ����������Ҳ��7�����������ο�����)
    ����ֶ������,ǰ���������ǿ��Ƶ�7�����������ö�λ��ʽ(0����Զ�λ��1�����Զ�λ)
    ��һ���������7��������0��ʱ����Զ�λ�����ǲ���������仯��ʱ�򣬿�����Ҳ���ű�
        1��Ĭ��1:�м����
        2�������¶��루0���ϣ�1���У�2���£�
        3������ߵľ���
        4��Y��ƫ����
        5�����ұߵľ���
        6���߶�
        7����λ��ʽ
        8�����ط�ʽ(0�����أ�1ȫ��ʱ���أ�2������)
        9��������ʱʱ�䣬ָ����뿪��������������ʱ������
    �ڶ����������7��������1��ʱ�򣬾��Զ�λ�����ǲ���������仯��ʱ�򣬿����������ű䣬���ַ�ʽһ��ʹ���ڿ�������С�����ʱ��
        1�������Ҷ��뷽ʽ��0����1���м䣬2���ң�
        2�������¶��루0���ϣ�1���У�2���£�
        3��xƫ����
        4��yƫ����
        5�����
        6���߶�
        7����λ��ʽ
        8�����ط�ʽ(0�����أ�1ȫ��ʱ���أ�2������)
        9��������ʱʱ��*/
    ck.pm_sch='1,2,15,-37,15,5,0,14,9';
    /*�������Ĳ���������ֶ������
        1-7��ǰ��7���������տ������ģ�
        8���϶���ť�Ŀ�
        9���϶���ť�ĸ�*/
    ck.pm_play='0,2,0,-30,35,30';
    /*
        1,2,3,4�����ź���ͣ��ť������
        5����ť��
        6����ť��
    ���ڰ�ť�Ŀ��ƻ�������ǰ�ĸ������꣬������ǿ��(�����swf�������ﲢ���������ã���Ҫ��html5����Ҫ)
    */
    ck.pm_clock='0,2,100,-25,2,0,0';
    /*
        1,2,3,4������ʱ�����ʱ���ı��������
        5���ı����뷽ʽ(0��1�У�2��)
        6�����
        7���߶�
    */
    ck.pm_clock2='0,2,40,-25,0,0,0';
    /*ͬ�ϣ�����Ҳ�ǲ���ʱ�����ʱ����ı���Ŀ��ƣ���Ҫ��Ϊ��Ҫ�ֲ�ͬ�ط���ʾ�Ѳ���ʱ�����ʱ�������*/
    ck.pm_full='2,2,-35,-30,35,30';
    /*
        1,2,3,4��ȫ����ȡ��ȫ����ť������
        5�����
        6���߶�
    */
    ck.pm_vol='2,2,-95,-18,53,4,6,12';
    /*
    �������ڿ������
        1,2,3,4���������
        5��������������Ŀ��
        6��������������ĸ߶�
        7���϶���ť�Ŀ��
        8���϶���ť�ĸ߶�
    */
    ck.pm_sound='2,2,-130,-30,35,30';
    /*
        1,2,3,4��������ȡ������������
        5�����
        6���߶�
    */
    ck.pm_fastf='2,2,-13,-39,13,9';
    /*
        1,2,3,4�����ť������
        5�����
        6���߶�
    */
    ck.pm_fastr='0,2,0,-39,13,9';
    /*
        1,2,3,4�����˰�ť������
        5�����
        6���߶�
        */
    ck.pm_pa='1,1,-30,-46,60,60,0,2,10,-120';
    /*
    �м���ͣ��ť��������ƣ��ĸ�һ��
        1,2,3,4��û����ͣ���ʱ������
        5�����
        6���߶�
        7,8,9,10������ͣ���ʱ������
    */
    ck.pm_bg='0x000000,100,230,180';
    /*����������ı�������
        1�����屳����ɫ
        2������͸����
        3����������С���
        4����������С�߶�
    */
    ck.pm_video='0,0,0,35,0x000000,0,0,0,0,0';
    /*��Ƶ�̶�����
        1��������δ����ʱ���Ԥ����
        2��������δ����ʱ����Ԥ���߶�
        3��������δ����ʱ�ұ�Ԥ�����
        4��������δ����ʱ����Ԥ���߶�
        5�������򱳾���ɫ
        6�������򱳾�͸����
        7������������ʱ���Ԥ����
        8������������ʱ����Ԥ���߶�
        9������������ʱ�ұ�Ԥ�����
        10������������ʱ����Ԥ���߶�
    */
    ck.pm_pr='0x000000,0303030,0xffffff,0,30,80,10';
    /*
    ��꾭����ť���������ʾһ��������ʾ��
        1����ʾ�򱳾���ɫ
        2���߿���ɫ
        3�����ֵ���ɫ
        4���߿�Ļ���
        5����ʾ��͸����
        6������͸����
        7���밴ť�ľ��룬����ָ��ʾ��ĵײ���������ʾ�İ�ť�Ϸ��ľ���
    */
    ck.pm_advbg='0x000,100';
    /*
    ����ǰ�ù��ʱ�ײ���ɫ��͸���ȣ�����һ���㣬��Ҫ������ס�������ϵ�����Ԫ����Ԫ�أ������û����
        1���ײ���ɫ
        2��͸����
    */
    ck.pm_padvc='1,1,172,-160';
    /*��ͣ���Ĺرհ�ť������*/
    ck.pm_start='8,5,0xFFFFFF,100';
    /*��������ʾ����ߣ���ɫ,͸����*/
    ck.pm_advms='2,2,-46,-56';
    /*�������رհ�ť����*/
    ck.pm_advmarquee='1,2,50,-60,50,18,0,0x000000,50,0,20,1,15,2000';
    /*
    �������Ŀ��ƣ�Ҫʹ�õĻ���Ҫ��setup��ĵ�9���������ó�1
        ǰ7�����������ö��տ�������pm_ctbar���Ľ�������
        8�������ֹ��ı���ɫ
        9���ñ���ɫ��͸����
        10�����ƹ�������0��ˮƽ�������������ң���1�����¹������������Ϻ����£�
        11���ƶ��ĵ�λʱ�������ƶ���λ��������Ҫ��ʱ��������
        12���ƶ��ĵ�λ����,����ͬ��/�ϣ���������/��
        13�����иߣ�������������ϻ����¹�����ʱ�����ô�
        14���������ϻ����¹���ʱÿ��ֹͣ��ʱ��
    */
    ck.advmarquee='';
    /*�ô��ǹ������ֹ������ݣ�����������������ã��Ͱ�������ղ�����ҳ����ʹ��js�ĺ�������function ckmarqueeadv(){return '�������'}*/
    ck.pr_load='{font color="#FFFFFF"}�Ѽ���[$prtage]%{/font}';
    ck.pr_noload='{font color="#FFFFFF"}����ʧ��{/font}';
    /*������Ƶ�ٷֱȣ��ַ�[$prtage]�����Զ��滻�ɰٷֱȵ�����,����ʧ�ܵ���ʾ*/
    ck.pr_buffer='{font color="#FFFFFF"}[$buffer]%{/font}';
    /*��Ƶ����ٷֱȵ�λ��Ĭ�Ͼ��У�����˵�������,�߶�,��ƫ�ƣ���/��������ƫ��(��/��),ֻ��ʾ�ٷֱ�����*/
    ck.pr_play='�������';
    ck.pr_pause='�����ͣ';
    ck.pr_mute='�������';
    ck.pr_nomute='ȡ������';
    ck.pr_full='���ȫ��';
    ck.pr_nofull='�˳�ȫ��';
    ck.pr_fastf='���';
    ck.pr_fastr='����';
    ck.pr_time='[$Time]';
    /*[$Time]���Զ��滻Ŀǰ������ʾ*/
    ck.pr_volume='����[$Volume]%';
    /*[$Volume]���Զ��滻����*/
    ck.pr_clock='';
    /*���ﶨ�����ʱ�����ʾ������ͬʱ���滻����������[$Time]�ᱻ�滻���Ѳ���ʱ�䣬[$TimeAll]�ᱻ�滻����ʱ��*/
    ck.pr_clock2='{font color="#FFFFFF" size="12"}[$Time] | [$TimeAll][$Timewait]{/font}';
    /*ͬpr_clock,���������ȵģ���Ҫ��Ϊ�˷����ڲ�ͬ�ĵط������Ѳ���ʱ�����ʱ��*/
    ck.pr_clockwait='�������';
    ck.pr_adv='{font color="#FFFFFF" size="12"}���ʣ�ࣺ{font color="#FF0000" size="15"}{b}[$Second]{/b}{/font} ��{/font}';//pr_adv='
    ck.myweb='';//myweb='
    /*
    ------------------------------------------------------------------------------------------------------------------
    �������ݲ����ǺͲ����ص����ã���ע�⣬�Զ������Լ������õ�������ʽҪע�⣬��Ҫ��ϵͳ�����ظ�����Ȼ�ͻ��滻��ϵͳ��������ã�ɾ����ز���Ļ�Ҳ����ͬʱɾ����ص�����
    ------------------------------------------------------------------------------------------------------------------
    �������ݶ����Զ�������������ã�����Ҳ�����Զ����κ��Լ��Ĳ����Ҫ���õ����ݣ���Ȼ�������ĳ�������ʹ�õĻ���Ҳ����ɾ����ص�����
    ------------------------------------------------------------------------------------------------------------------
    */
    ck.cpt_lights='1';
    /*�ô������Ƿ�ʹ�ÿ��صƣ���right.swf����������,ʹ�ÿ���Ч��ʱ����ҳ���js����function closelights(){};*/
    ck.cpt_share='ckplayer/share.xml';
    /*���������õ������ļ���ַ*/
    //���ò����ʼ
    ck.cpt_list = ckcpt();
    return ck;
}
/*
html5���ֿ�ʼ
���´�����֧��html5�ģ�����㲻��Ҫ������ɾ����
html5�����Ĵ����������������ʺ����Ӧ�ã���ӭ����̳���������ĵ�
*/
(function() {   
    var html5object= {
        getParameter:function (obj,index){
            var _obj=this._S_[obj];
            var _arr=_obj.split(',');
            if (_arr.length>index){
                return _arr[index];
            }
        },
        getVideo:function(str){
            var source='';
            if(str){
                for(var key in str){
                    source+='<source src="'+key+'"';
                    if(str[key]){
                        source+=' type="'+str[key]+'"';
                    }
                    source+='>';
                }
            }
            return source;
        },
        getVars:function(vars,key){
            if(vars[key]){
                return vars[key];
            }
        },
        getParams:function(vars){
            var params='';
            if(vars){
                if(this.getVars(vars,'p')==1 && this.getVars(vars,'m')!=1){
                    params+=' autoplay="autoplay"'
                }
                if(this.getVars(vars,'e')==1){
                    params+=' loop="loop"'
                }
                if(this.getVars(vars,'m')==1){
                    params+=' preload="meta"'
                }
                if(this.getVars(vars,'i')){
                    params+=' poster="'+this.getVars(vars,'i')+'"'
                }
            }
            return params;
        },
        getXY:function(Con,Com,Img,Iid,Text,OnImg){//Conָdiv��id����play_,Comָ����ckstyle������������
            this._Z_+=1;
            var cpath=this.getParameter('cpath',0);
            var _x=parseInt(this.getParameter(Com,0));
            var _y=parseInt(this.getParameter(Com,1));
            var _zx=parseInt(this.getParameter(Com,2));
            var _zy=parseInt(this.getParameter(Com,3));
            var _cw=parseInt(this.getParameter(Com,4));
            var _ch=parseInt(this.getParameter(Com,5));
            var _w=parseInt(this._K_('ck_'+this._I_).style.width);
            var _h=parseInt(this._K_('ck_'+this._I_).style.height);
            var _xz=0;
            var _yz=0;
            var _Pid=this._K_(Con+this._I_);
            var _Oimg='',_Mimg='';
            switch(Com){//����һЩ�����λ��
                case 'pm_clock':
                case 'pm_clock2':
                    _cw=100;
                    _ch=parseInt(this.getParameter(Com,6));
                    break;
                default:
                    break;
            }
            switch(_x){
                case 0:
                    _xz=_zx;
                    break;
                case 1:
                    _xz=(_w*0.5)+_zx;
                    break;
                case 2:
                    _xz=_w+_zx;
                    break;  
                default:
                    break;
            }
            switch(_y){
                case 0:
                    _yz=-(_h-_zy);
                    break;
                case 1:
                    _yz=-((_h*0.5)-_zx);
                    break;
                case 2:
                    _yz=_zy;
                    break;  
                default:
                    break;
            }
            _Pid.style.marginTop=_yz+'px';
            _Pid.style.marginLeft=_xz+'px';
            _Pid.style.position='absolute';
            _Pid.style.cursor='pointer';
            if(!Text){
                _Pid.style.width=_cw+'px';
                _Pid.style.height=_ch+'px';
            }
            
            if(Img){
                if(Iid>0){
                    _Pid.style.backgroundImage='url('+cpath+this.getParameter(Img,Iid)+')';
                }
                else{
                    _Pid.style.backgroundImage='url('+cpath+this.getParameter(Img,0)+')';
                }
                if(OnImg){
                    _Oimg=cpath+this.getParameter(Img,Iid);
                    _Mimg=cpath+this.getParameter(Img,(Iid+1));
                    _Pid.onmouseover=function (){
                        this.style.backgroundImage='url('+_Mimg+')';
                    }
                    _Pid.onmouseout=function (){
                        this.style.backgroundImage='url('+_Oimg+')';
                    }
                }
            }
            this._K_(Con+this._I_).style.zIndex=this._Z_;
        },
        getBar:function(Con,Com){//Conָdiv��id����play_,Comָ����ckstyle������������
            this._Z_+=1
            var _xa=parseInt(this.getParameter(Com,0));
            var _ya=parseInt(this.getParameter(Com,1));
            var _x=parseInt(this.getParameter(Com,2));
            var _y=parseInt(this.getParameter(Com,3));
            var _zx=parseInt(this.getParameter(Com,4));
            var _zy=parseInt(this.getParameter(Com,5));
            var _d=parseInt(this.getParameter(Com,6));
            var _w=parseInt(this._K_('ck_'+this._I_).style.width);
            var _h=parseInt(this._K_('ck_'+this._I_).style.height);
            var _mw=0;
            var _mh=0;
            var _xz=0;
            var _yz=0;
            var _Pid=this._K_(Con+this._I_);
            if(_d==0){//��Զ�λ
                switch(_ya){
                    case 0:
                        _yz=-(_w-_y);
                        break;
                    case 1:
                        _yz=-((_w*0.5)-_y);
                        break;
                    case 2:
                        _yz=-_y;
                        break;  
                    default:
                        break;
                }
                _mw=_w-_x-_zx;
                _mh=_zy;
                _xz=_x;
            }
            else{
                switch(_xa){
                    case 0:
                        _xz=_x;
                        break;
                    case 1:
                        _xz=(_w*0.5)+_x;
                        break;
                    case 2:
                        _xz=_w+_x;
                        break;  
                    default:
                        break;
                }
                switch(_ya){
                    case '0':
                        _yz=-(_h-_y);
                        break;
                    case '1':
                        _yz=-((_h*0.5)-_y);
                        break;
                    case '2':
                        _yz=-_y;
                        break;  
                    default:
                        break;
                }
                _mw=_zx;
                _mh=_zy;
            }
            _Pid.style.width=_mw+'px';
            _Pid.style.height=_mh+'px';
            _Pid.style.marginLeft=_xz+'px';
            _Pid.style.marginTop=-_yz+'px';
            _Pid.style.position='absolute';
            _Pid.style.zIndex=this._Z_;
        },
        addEventHandler:function(oTarget, sEventType, fnHandler) {//��������(id),�¼�����,�����ĺ���
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            }
            else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            }
            else {
                oTarget["on" + sEventType] = fnHandler;
            }
        },
        removeEventHandler:function(oTarget, sEventType, fnHandler) {//��������(id),�¼�����,�����ĺ���
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            }
            else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            }
            else { 
                oTarget["on" + sEventType] = null;
            }
        },
        coordinate:function(){
            var cpath=this.getParameter('cpath',0);
            var _Oimg='',_Oimg2='',_Mimg='',_Mimg2='';
            this.getBar('controlbar_','pm_ctbar');
            this._K_('controlbar_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('controlbar',0)+')';
            this.getBar('schedule_','pm_sch');
            this._K_('schedule_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('schedule',0)+')';
            this.getBar('schload_','pm_sch');
            this._K_('schload_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('schedule',1)+')';
            this.getBar('schplay_','pm_sch');
            this._K_('schplay_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('schedule',2)+')';
            this.getXY('play_','pm_play','cplay',0,false,true);
            this.getXY('pause_','pm_play','cpause',0,false,true);
            this.getXY('clock_','pm_clock','',0,false,false);
            this.getXY('clock2_','pm_clock2','',0,false,false);
            this.getXY('sound_','pm_sound','sound',0,false,true);
            this.getXY('mute_','pm_sound','mute',0,false,true);
            this.getXY('full_','pm_full','full',0,false,true);
            this.getXY('general_','pm_full','general',0,false,true);
            this.getXY('fastf_','pm_fastf','fast',0,false,true);
            this.getXY('fastr_','pm_fastr','fast',2,false,true);
            this.getXY('pausec_','pm_pa','pausec',0,false,true);
            this.getXY('vol_','pm_vol','cvolume',0,false,false);
            this.getXY('vol2_','pm_vol','cvolume',1,false,false);
            //������Ȼ������������
            this._K_('slideplay_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('schedule',3)+')';
            this._K_('slideplay_'+this._I_).style.width=this.getParameter('pm_sch',7)+'px';
            this._K_('slideplay_'+this._I_).style.height=this.getParameter('pm_sch',8)+'px';
            this._K_('slideplay_'+this._I_).style.marginTop=parseInt(parseInt(this._K_('schplay_'+this._I_).style.marginTop)+(parseInt(this._K_('schplay_'+this._I_).style.height)-parseInt(this._K_('slideplay_'+this._I_).style.height))*0.5)+'px';
            this._K_('slideplay_'+this._I_).style.position='absolute';
            this._K_('slideplay_'+this._I_).style.zIndex=this._Z_+1;
            this._K_('slideplay_'+this._I_).style.cursor='pointer';
            this._K_('slidevolume_'+this._I_).style.backgroundImage='url('+cpath+this.getParameter('cvolume',2)+')';
            this._K_('slidevolume_'+this._I_).style.width=this.getParameter('pm_vol',6)+'px';
            this._K_('slidevolume_'+this._I_).style.height=this.getParameter('pm_vol',7)+'px';
            this._K_('slidevolume_'+this._I_).style.marginTop=parseInt(parseInt(this._K_('vol2_'+this._I_).style.marginTop)+(parseInt(this._K_('vol2_'+this._I_).style.height)-parseInt(this._K_('slidevolume_'+this._I_).style.height))*0.5)+'px';
            this._K_('slidevolume_'+this._I_).style.position='absolute';
            this._K_('slidevolume_'+this._I_).style.zIndex=this._Z_+1;
            this._K_('slidevolume_'+this._I_).style.cursor='pointer';
            //ע������϶���ť���������ڰ�ť����ʽ
            _Oimg=cpath+this.getParameter('schedule',3);
            _Oimg2=cpath+this.getParameter('cvolume',2);
    
            _Mimg=cpath+this.getParameter('schedule',4);
            _Mimg2=cpath+this.getParameter('cvolume',3);
            this._K_('slideplay_'+this._I_).onmouseover=function (){
                this.style.backgroundImage='url('+_Mimg+')';
            }
            this._K_('slideplay_'+this._I_).onmouseout=function (){
                this.style.backgroundImage='url('+_Oimg+')';
            }
            this._K_('slidevolume_'+this._I_).onmouseover=function (){
                this.style.backgroundImage='url('+_Mimg2+')';
            }
            this._K_('slidevolume_'+this._I_).onmouseout=function (){
                this.style.backgroundImage='url('+_Oimg2+')';
            }
            //ע������϶���ť���������ڰ�ť����ʽ����
            this._K_('schplay_'+this._I_).style.width='1px';
            this._SPlay=true;
            this.getSslide();
            this.getVslide();
        },
        getSslide:function(){
            if(this._SPlay){
                var _px=0;//�������x_C_.getParameter('pm_fasttime',0)
                var _pw=parseInt(this.getParameter('pm_sch',7));//������Ŀ�
                var _sx=parseInt(this._K_('schplay_'+this._I_).style.marginLeft);//��������x
                var _sw=parseInt(this._K_('schplay_'+this._I_).style.width);//�������Ŀ�
                var _sw2=parseInt(this._K_('schedule_'+this._I_).style.width);//���������ܿ�
                _px=parseInt(_sx+_sw-(_pw*0.5));
                if(_px<_sx) _px=_sx;
                if(_px>(_sx+_sw2-_pw)) _px=_sx+_sw2-_pw;
                this._K_('slideplay_'+this._I_).style.marginLeft=_px+'px';
            }
        },
        getVslide:function(){
            var _vx=0;//�������x
            var _vw=parseInt(this.getParameter('pm_vol',6));//������Ŀ�
            var _sx=parseInt(this._K_('vol_'+this._I_).style.marginLeft);//������x
            var _sw=parseInt(this._K_('vol2_'+this._I_).style.width);//�����Ŀ�
            var _sw2=parseInt(this._K_('vol_'+this._I_).style.width);//�����Ŀ�
            _vx=parseInt(_sx+_sw-parseInt(_vw*0.5));
            if(_vx<_sx)_vx=_sx;
            if(_vx>(_sx+_sw2-_vw))_vx=_sx+_sw2-_vw;
            this._K_('slidevolume_'+this._I_).style.marginLeft=_vx+'px';
        },
        adddiv:function(arr){//�������齨��div
            var div='';
            if(arr){
                var id=arr.split(',');
                for(var i=0;i<id.length;i++){
                    div+='<div id="'+id[i]+'_'+this._I_+'" oncontextmenu="return false;"></div>';
                }
            }
            return div;
        },
        sh:function (Id){
            var show = arguments[1] ? arguments[1] : false;
            this._K_(Id).style.display='none';
            if (show){
                this._K_(Id).style.display='block';
            }
        },
        gethtml:function(str){
            var _str=str;
            if(_str){
                _str=_str.split('{').join('<');
                _str=_str.split('}').join('>');
                _str=_str.replace(/<font/,'<span style="');
                _str=_str.replace(/\/font>/,'/span>');
                _str=_str.replace(/size="([0-9]+)"/,'font-size:$1px;line-height: 20px;');
                _str=_str.replace(/color="#(\w*)"/,'color:#$1;');
                _str=_str.replace(/face="(\w*)"/,'font-family: "$1";');
                _str=_str.replace(/face="*([\u4e00-\u9fa5]+.*)"/,'font-family: "$1";');
                _str=_str.split(';>').join(';">');
            }
            return _str;
        },
        formatTime: function(seconds) {
            var showm = arguments[1] ? arguments[1] : false;
            var s = Math.floor(seconds % 60),
            m = Math.floor(seconds / 60 % 60),
            h = Math.floor(seconds / 3600);
            s = (s < 10) ? "0" + s: s;
            m = (m>0)?((m < 10) ? "0" + m+':': m+':'):'00:';
            h = (h>0)?((h < 10) ? "0" + h+':': h+':'):'';
            if(showm && !m) m='00:';
            return h + m + s
        },
        browser:function(){//��ȡ��������ͺͰ汾
            var Browser = (function(ua){
                var a=new Object();
                var b = {
                    msie: /msie/.test(ua) && !/opera/.test(ua),
                    opera: /opera/.test(ua),
                    safari: /webkit/.test(ua) && !/chrome/.test(ua),
                    firefox: /firefox/.test(ua),
                    chrome: /chrome/.test(ua)
                };
                var vMark = "";
                for (var i in b) {
                    if (b[i]) { vMark = "safari" == i ? "version" : i; break; }
                }
                b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";
                b.ie = b.msie;
                b.ie6 = b.msie && parseInt(b.version, 10) == 6;
                b.ie7 = b.msie && parseInt(b.version, 10) == 7;
                b.ie8 = b.msie && parseInt(b.version, 10) == 8;
                a.B=vMark;
                a.V=b.version
                return a;
            })(window.navigator.userAgent.toLowerCase());
            return Browser;
        },
        Platform:function(){//ƽ̨����
            var w=''; 
            var u = navigator.userAgent, app = navigator.appVersion;              
            var b={                  
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //�Ƿ�ΪiPhone����QQHD�����                  
                iPad: u.indexOf('iPad') > -1, //�Ƿ�iPad 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios�ն�  
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android�ն˻���uc�����    
                trident: u.indexOf('Trident') > -1, //IE�ں�                  
                presto: u.indexOf('Presto') > -1, //opera�ں�                  
                webKit: u.indexOf('AppleWebKit') > -1, //ƻ�����ȸ��ں�                  
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //����ں�                  
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //�Ƿ�Ϊ�ƶ��ն�
                webApp: u.indexOf('Safari') == -1 //�Ƿ�webӦ�ó���û��ͷ����ײ�            
            };  
            for (var key in b){
                if(b[key]){
                    w=key;
                    break;
                }
            }
            return w;
        },
        getidPoint:function(e,xy){      
            var x = e.offsetLeft,y = e.offsetTop;      
            while(e=e.offsetParent){    
               x += e.offsetLeft;      
               y += e.offsetTop;   
            }
            if(xy){
                return x;
            }
            else{
                return y;
            }
        },
        formatClock:function(Time,TimeAll){
            this._K_('clock_'+this._I_).innerHTML=this.gethtml(this._S_['pr_clock']).split('[$Time]').join(Time).split('[$TimeAll]').join(TimeAll).split('[$Timewait]').join('');
            this._K_('clock2_'+this._I_).innerHTML=this.gethtml(this._S_['pr_clock2']).split('[$Time]').join(Time).split('[$TimeAll]').join(TimeAll).split('[$Timewait]').join('');
        },
        embedHTML5:function(Container,PlayerId,Width,Height,Video,Vars,support){//����,��Ƶ������ID,��,��,��Ƶ��ַ����,���ö���-�൱��swf����ʱ��flashvars
            var show=false;
            var b=this.browser()['B'];
            var v=this.browser()['V'];
            var va=v.split('.');
            var v1=va[0];
            this.Plat=this.Platform();
            var br=b+v;
            var br2=b+v1;
            if(!support){
                support=['iPad','iPhone','ios'];
            }
            for(var i=0;i<support.length;i++){
                if(this.Plat==support[i] || br==support[i] || br2==support[i]){
                    show=true;
                    break;
                }
            }
            if(show){
                this.ck_HTML5(Container,PlayerId,Width,Height,Video,Vars,support);
            }
        },
        ck_HTML5:function(Container,PlayerId,Width,Height,Video,Vars,support){
            var _C_=html5object;
            this._I_=PlayerId;
            this._S_ = ckstyle();
            this._K_=function(str){return document.getElementById(str);};
            this._Z_=100;
            this._CW_=Width;
            this._CH_=Height;
            var V='<div id="ck_'+PlayerId+'" style="height:'+Height+'px;"><video oncontextmenu="return false;"  id="'+PlayerId+'" width="'+Width+'" height="'+(Height-this.getParameter('pm_video',3))+'"'+this.getParams(Vars)+'>'+this.getVideo(Video)+'</video></div>';
            var V2='<div id="ck_'+PlayerId+'" style="height:'+Height+'px;"><video controls id="'+PlayerId+'" width="'+Width+'" height="'+Height+'"'+this.getParams(Vars)+'>'+this.getVideo(Video)+'</video></div>';
            var D=this.adddiv('controlbar,schedule,schload,schplay,slideplay,slidevolume,play,pause,sound,mute,vol,vol2,full,general,fastf,fastr,pausec,clock,clock2');
            if(this.Plat=='iPad' || this.Plat=='iPhone' || this.Plat=='ios'){
                this._K_(Container).innerHTML=V2;
            }
            else{
                this._K_(Container).innerHTML=V+D;  
            }
            this._V_=this._K_(PlayerId);
            this._D_=this._K_(Container);
            this._K_(Container).style.width=Width+'px';
            this._K_(Container).style.height=Height+'px';
            this._K_(Container).style.overflow='hidden';
            if(this.getVars(Vars,'b')) this._K_(Container).style.backgroundColor=this.getVars(Vars,'b').replace('0x','#');
            this._K_('ck_'+this._I_).style.width=Width+'px';
            this._K_('ck_'+this._I_).style.height=Height+'px';
            this.coordinate();
            if(this.getVars(Vars,'p')==1){
                this.sh('play_'+PlayerId,true);
                this.sh('pausec_'+PlayerId,true);
            }
            else{
                this.sh('pause_'+PlayerId);
            }
            this.sh('mute_'+PlayerId);
            this.sh('general_'+PlayerId);
            this.formatClock('00:00','00:00');
            if (this.getVars(Vars,'v')){this._V_.volume=this.getVars(Vars,'v')*0.01;}else{this._V_.volume=0.8;}
            //����ť�Ķ���
            this.addEventHandler(this._V_,'click',function(){_C_.playorpause();},false);
            this.addEventHandler(this._K_('play_'+PlayerId),'click',function(){_C_.playorpause();},false);
            this.addEventHandler(this._K_('pause_'+PlayerId),'click',function(){_C_.playorpause();},false);
            this.addEventHandler(this._K_('pausec_'+PlayerId),'click',function(){_C_.playorpause();},false);
            this.addEventHandler(this._K_('sound_'+PlayerId),'click',function(){_C_.vmuted();},false);
            this.addEventHandler(this._K_('mute_'+PlayerId),'click',function(){_C_.vmuted();},false);
            this.addEventHandler(this._K_('fastf_'+PlayerId),'click',function(){_C_.fastforward('next');},false);
            this.addEventHandler(this._K_('fastr_'+PlayerId),'click',function(){_C_.fastforward('last');},false);
            this.addEventHandler(this._K_('full_'+PlayerId),'click',function(){_C_.fullscreen();},false);
            this.addEventHandler(this._K_('general_'+PlayerId),'click',function(){_C_.fullscreen();},false);
            this.addEventHandler(this._V_,'play',function(){_C_.Status_play();},false);
            this.addEventHandler(this._V_,'pause',function(){_C_.Status_play();},false);
            this.addEventHandler(this._V_,'error',function(){_C_.Status_error();},false);
            this.addEventHandler(this._V_,'loadstart',function(){_C_.Status_loadstart();},false);
            this.addEventHandler(this._V_,'loadedmetadata',function(){_C_.Status_loadedmetadata();},false);
            this.addEventHandler(this._V_,'ended',function(){_C_.Status_ended();},false);
            this.addEventHandler(this._V_,'timeupdate',function(){_C_.Status_timeupdate();},false);
            this.addEventHandler(this._V_,'volumechange',function(){_C_.Status_volumechange();},false);
            //�����϶���
            this._SVDown=function(){_C_.slidevolume_mousedown();};
            this._SVMove=function(){_C_.slidevolume_mousemove();};
            this._SVUp=function(){_C_.slidevolume_mouseup();};
            //�����϶���
            this._SPDown=function(){_C_.slideplay_mousedown();};
            this._SPMove=function(){_C_.slideplay_mousemove();};
            this._SPUp=function(){_C_.slideplay_mouseup();};
            this.addEventHandler(this._K_('slidevolume_'+PlayerId),'mousedown',this._SVDown);//�����϶���
            this.addEventHandler(this._K_('vol_'+PlayerId),'mousedown',this._SVDown);
            this.addEventHandler(this._K_('vol2_'+PlayerId),'mousedown',this._SVDown);
            this.addEventHandler(this._K_('vol_'+PlayerId),'click',function(){_C_.slidevolume_click();});
            this.addEventHandler(this._K_('vol2_'+PlayerId),'click',function(){_C_.slidevolume_click();});
            this.addEventHandler(this._K_('slideplay_'+PlayerId),'mousedown',this._SPDown);//�����϶���
            this.addEventHandler(this._K_('schedule_'+PlayerId),'mousedown',this._SPDown);
            this.addEventHandler(this._K_('schload_'+PlayerId),'mousedown',this._SPDown);
            this.addEventHandler(this._K_('schplay_'+PlayerId),'mousedown',this._SPDown);
            this.addEventHandler(this._K_('schedule_'+PlayerId),'click',function(){_C_.slideplay_click();});
            this.addEventHandler(this._K_('schload_'+PlayerId),'click',function(){_C_.slideplay_click();});
            this.addEventHandler(this._K_('schplay_'+PlayerId),'click',function(){_C_.slideplay_click();});
            this.addEventHandler(this._D_,_FullApi.fullScreenEventName,function(){if (_FullApi.isFullScreen()) {_C_.resetcoor();} else {_C_.reduction();}},true);
        },
        fullscreen:function(){
            if (!_FullApi.isFullScreen()) {  
                window._FullApi.requestFullScreen(this._D_);
                this.resetcoor();//��ʵ����ִ���˶��Σ�����Բ�����������ݵ�
            }  
            else {
                window._FullApi.cancelFullScreen(document);
                this.reduction();
            }
        },
        resetcoor:function(){//ȫ�������¶�λ�ؼ�
            //alert(window.screen.width);
            this._D_.style.width=window.screen.width+'px';
            this._D_.style.height=window.screen.height+'px';
            this._K_('ck_'+this._I_).style.width=this._D_.offsetWidth+'px';
            this._K_('ck_'+this._I_).style.height=this._D_.offsetHeight+'px';
            this._V_.width=this._D_.offsetWidth;
            this._V_.height=(this._D_.offsetHeight-this.getParameter('pm_video',3))
            this.coordinate();
            this.sh('full_'+this._I_);
            this.sh('general_'+this._I_,true);
        },
        reduction:function(){//�˳�ȫ�������¶�λ�ؼ�
            this._D_.style.width=this._CW_+'px';
            this._D_.style.height=this._CH_+'px';
            this._K_('ck_'+this._I_).style.width=this._D_.offsetWidth+'px';
            this._K_('ck_'+this._I_).style.height=this._D_.offsetHeight+'px';
            this._V_.width=this._CW_;
            this._V_.height=(this._CH_-this.getParameter('pm_video',3))
            this.coordinate();
            this.sh('full_'+this._I_,true);
            this.sh('general_'+this._I_);
        },
        slidevolume_mousedown:function(){//�������������������
            this._x=parseInt(this._K_('slidevolume_'+this._I_).style.marginLeft);//�����벥������ߵľ���
            this._svx=this.getidPoint(this._K_(this._I_),true);
            this.addEventHandler(document, "mousemove",this._SVMove);   
            this.addEventHandler(document, "mouseup",this._SVUp);   
        },
        slidevolume_mousemove:function(){//����������������������϶�����
            var _SV_=this._K_('slidevolume_'+this._I_);
            var _nx=event.clientX-this._svx-parseInt(parseInt(_SV_.style.width)*0.5);
            var _left=parseInt(this._K_('vol_'+this._I_).style.marginLeft);
            var _right=parseInt(parseInt(_left + parseInt(this._K_('vol_'+this._I_).style.width))-parseInt(_SV_.style.width));
            if (_nx<_left) _nx=_left;
            if (_nx>_right) _nx=_right;
            _SV_.style.marginLeft=_nx+'px';
            this._K_('vol2_'+this._I_).style.width=_nx-_left+parseInt(parseInt(_SV_.style.width)*0.5)+'px';
            this.getVslide();
        },
        slidevolume_mouseup:function(){//��������������굯��Ķ���
            this.removeEventHandler(document, "mousemove",this._SVMove);    
            this.removeEventHandler(document, "mouseup", this._SVUp);
        },
        slidevolume_click:function(){//�����������ϵ���Ķ���
            this._svx=this.getidPoint(this._K_(this._I_),true);
            var _SV_=this._K_('slidevolume_'+this._I_);
            var _nx=event.clientX-this._svx-parseInt(parseInt(_SV_.style.width)*0.5);
            var _left=parseInt(this._K_('vol_'+this._I_).style.marginLeft);
            var _right=parseInt(parseInt(_left + parseInt(this._K_('vol_'+this._I_).style.width))-parseInt(_SV_.style.width));
            if (_nx<_left) _nx=_left;
            if (_nx>_right) _nx=_right;
            _SV_.style.marginLeft=_nx+'px';
            this._K_('vol2_'+this._I_).style.width=_nx-_left+parseInt(parseInt(_SV_.style.width)*0.5)+'px';
            this.getVslide();
        },
        slideplay_mousedown:function(){//�������ϰ������Ķ���
            this._SPlay=false;
            this._x=parseInt(this._K_('slideplay_'+this._I_).style.marginLeft);//�����벥������ߵľ���
            this._svx=this.getidPoint(this._K_(this._I_),true);
            this.addEventHandler(document, "mousemove",this._SPMove);   
            this.addEventHandler(document, "mouseup",this._SPUp);   
        },
        slideplay_mousemove:function(){//��������갴�º��϶�
            var _SV_=this._K_('slideplay_'+this._I_);
            var _nx=event.clientX-this._svx-parseInt(parseInt(_SV_.style.width)*0.5);
            var _left=parseInt(this._K_('schload_'+this._I_).style.marginLeft);
            var _right=parseInt(parseInt(_left + parseInt(this._K_('schedule_'+this._I_).style.width))-parseInt(_SV_.style.width));
            if (_nx<_left) _nx=_left;
            if (_nx>_right) _nx=_right;
            _SV_.style.marginLeft=_nx+'px';
            this._K_('schplay_'+this._I_).style.width=_nx-_left+parseInt(parseInt(_SV_.style.width)*0.5)+'px';
        },
        slideplay_mouseup:function(){//��������굯��Ķ���
            this.removeEventHandler(document, "mousemove",this._SPMove);    
            this.removeEventHandler(document, "mouseup", this._SPUp);
            this.slideplay_play();
        },
        slideplay_play:function(){//���ݲ�������ָλ�õõ�Ҫ���ŵ�ʱ��
            var _tw=parseInt(this._V_.duration);//��ȡ��ʱ��
            var _sw=parseInt(this._K_('schplay_'+this._I_).style.width);//�������Ŀ�
            var _sw2=parseInt(this._K_('schedule_'+this._I_).style.width);//���������ܿ�
            var _nt=parseInt(_tw*_sw/_sw2);
            var _seekend=this._V_.seekable.end(0);
            var _seekstart=this._V_.seekable.start(0);
            if(_nt<_seekstart){
                _nt=_seekstart
            }
            if(_nt>_seekend){
                _nt=_seekend
            }
            this._V_.currentTime=_nt;
            this.getSslide();
            this._SPlay=true;
            this._V_.play()
        },
        slideplay_click:function(){//������������Ķ���
            this._SPlay=false;
            this._svx=this.getidPoint(this._K_(this._I_),true);
            var _SV_=this._K_('slideplay_'+this._I_);
            var _nx=event.clientX-this._svx-parseInt(parseInt(_SV_.style.width)*0.5);
            var _left=parseInt(this._K_('schload_'+this._I_).style.marginLeft);
            var _right=parseInt(parseInt(_left + parseInt(this._K_('schedule_'+this._I_).style.width))-parseInt(_SV_.style.width));
            if (_nx<_left) _nx=_left;
            if (_nx>_right) _nx=_right;
            _SV_.style.marginLeft=_nx+'px';
            this._K_('schplay_'+this._I_).style.width=_nx-_left+parseInt(parseInt(_SV_.style.width)*0.5)+'px';
            this.slideplay_play();
        },
        fastforward:function(str){//������˵Ķ���
            var _nt=parseInt(this._V_.currentTime);
            var _ft=parseInt(this.getParameter('setup',21));
            var _seekend=this._V_.seekable.end(0);
            var _seekstart=this._V_.seekable.start(0);
            if(str=='next'){
                _nt+=_ft;
            }
            else{
                _nt-=_ft;
            }
            if(_nt<_seekstart){
                _nt=_seekstart
            }
            if(_nt>_seekend){
                _nt=_seekend
            }
            this._V_.currentTime=_nt;
            this.getSslide();
            this._SPlay=true;
            this._V_.play()
        },
        Status_ended:function(){//��Ƶ���Ž���
            //alert(obj.duration);
        },
        Status_loadedmetadata:function(){//����Ƶ��ȡ��Ԫ����ʱ
            this.formatClock('00:00',this.formatTime(this._V_.duration));
            this.Status_buffered();
        },
        Status_buffered:function(){//����Ƶ����ʱ
            var buffered = this._V_.buffered,
            start = 0,
            end = this._V_.duration;
            if (buffered && buffered.length > 0 && buffered.end(0) !== end) {
                end = buffered.end(0);
                setTimeout(function(){this.Status_buffered()},500);
            }
            this.Status_loadend(buffered.end(0));
        },
        Status_loadstart:function(obj){//���ؿ�ʼ
            //alert(obj.duration);
        },
        Status_error:function(obj){//���ų���
            //alert(obj.error);
        },
        Status_timeupdate:function(){//����ʱ��
            var _nt=parseInt(this._V_.currentTime);//��ǰʱ��
            var _at=parseInt(this._V_.duration);
            var _sw=parseInt(this.getParameter('pm_sch',7));//�����
            var _jw=parseInt(this._K_('schedule_'+this._I_).style.width)-parseInt(_sw*0.5);//������
            var _nw=parseInt(_nt*_jw/_at);
            if(this._SPlay){
                this._K_('schplay_'+this._I_).style.width=_nw+'px';
                this.getSslide();
            }
            this.formatClock(this.formatTime(this._V_.currentTime,true),this.formatTime(this._V_.duration));
        },
        Status_loadend:function(nowbuffer){//���ؽ���
            var _nt=nowbuffer;//��ǰ�Ѽ���
            var _at=this._V_.duration;//�������
            var _jw=parseInt(this._K_('schedule_'+this._I_).style.width);//������
            var _nw=Math.ceil(_nt*_jw/_at);
            this._K_('schload_'+this._I_).style.width=_nw+'px';
        },
        Status_play:function(){//��������
            if(this._V_.paused){
                this.sh('play_'+this._I_,true);
                this.sh('pausec_'+this._I_,true);
                this.sh('pause_'+this._I_);
            }
            else{
                this.sh('play_'+this._I_);
                this.sh('pausec_'+this._I_);
                this.sh('pause_'+this._I_,true);
            }
        },
        Status_volumechange:function(){//�ı�����
            var _nv=parseInt(this._V_.volume*100);//��ǰ����
            var _sw=parseInt(this.getParameter('pm_vol',6));//�����
            var _vw=parseInt(this._K_('vol_'+this._I_).style.width)-parseInt(_sw*0.5);//����������
            var _nw=parseInt(_vw*_nv*0.01);
            this._K_('vol2_'+this._I_).style.width=_nw+'px';
            this.getVslide();
            if(this._V_.muted){
                this.sh('sound_'+this._I_);
                this.sh('mute_'+this._I_,true);
            }
            else{
                this.sh('sound_'+this._I_,true);
                this.sh('mute_'+this._I_);
            }
        },
        playorpause:function(){
            this._V_.paused ? this._V_.play() : this._V_.pause();
        },
        vmuted:function(obj){
            this._V_.muted ? this._V_.muted=false : this._V_.muted=true;
        }
    },
    _FullApi = {//ȫ������
        supportsFullScreen: false,
        isFullScreen: function() { return false; }, 
        requestFullScreen: function() {}, 
        cancelFullScreen: function() {},
        fullScreenEventName: '',
        prefix: ''
    },
    browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    if (typeof document.cancelFullScreen != 'undefined') {
        _FullApi.supportsFullScreen = true;
    } 
    else {   
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            _FullApi.prefix = browserPrefixes[i];
            if (typeof document[_FullApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                _FullApi.supportsFullScreen = true;
                break;
            }
        }
    }
    if (_FullApi.supportsFullScreen) {
        _FullApi.fullScreenEventName = _FullApi.prefix + 'fullscreenchange';
        _FullApi.isFullScreen = function() {
            switch (this.prefix) {  
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        _FullApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        _FullApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }       
    }
    window._FullApi = _FullApi;
    window.html5object = html5object;
})(); 
/*
html5 ���ֽ���
======================================================
SWFObject v2.2
��������վ���Ѿ���swfobject�࣬����ɾ�������
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();