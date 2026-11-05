Khuôn file nạp đề OSCE (Markdown)
=================================

File nạp là một file `.md` thường. Mỗi file có thể chứa một hoặc nhiều trạm; mỗi trạm có nhiều đề; mỗi đề có nhiều bước.
Phần chữ giới thiệu ở đầu file (trước dòng `# TRẠM:` đầu tiên) và mọi chú thích `<!-- … -->` đều được bỏ qua khi nạp.

Quy tắc chung
-------------

- Chỉ các dòng cấu trúc dưới đây mới có ý nghĩa đặc biệt; viết **đúng chữ, đúng số dấu #**.
- Mọi dòng khác (danh sách `-`, `+`, `*`, `1.`, chữ đậm `**…**`, ảnh `![](đường-dẫn)`, tiêu đề `#####`…) là **nội dung**, được giữ nguyên chữ.
- Dòng `Soạn thêm:` (đứng riêng một dòng) trong mục Mở đầu, Tác vụ, Đề, Kết quả: mọi chữ **phía dưới** dòng này thuộc phần tự soạn thêm và sẽ được gắn nhãn "soạn thêm" trên web. Chữ phía trên là nguyên văn tài liệu.
- Tên bước hợp lệ: `Hỏi bệnh`, `Khám`, `Cận lâm sàng`, `Chẩn đoán – nhận định`, `Xử trí – tư vấn` (viết tắt được: `Chẩn đoán`, `Xử trí`, `Tư vấn`). Các bước hiện theo đúng thứ tự viết trong file.
- Lỗi sẽ báo kèm số dòng: thiếu `### Mở đầu`, bước thiếu `#### Đề`, tên bước lạ, trùng tên/mã đề, thiếu `Chương:`, dòng nằm ngoài mục…

Khuôn trống (chú thích từng dòng)
---------------------------------

```text
# TRẠM: <tên trạm>                  ← bắt đầu một trạm (bắt buộc)
Mã: <ma-tram>                       ← mã không dấu, không trùng; bỏ trống thì tự tạo từ tên. Trùng mã trạm có sẵn = thêm đề vào trạm đó
Chương: CHƯƠNG <số>: <TÊN CHƯƠNG>   ← bắt buộc; trùng tên chương có sẵn thì xếp vào chương đó
Tên gốc: <tiêu đề trong tài liệu>   ← tùy chọn

## LÝ THUYẾT                        ← tùy chọn: "Lý thuyết cần nhớ" hiện ở trang trạm
<nội dung>

## ĐÁP ÁN MẪU                       ← tùy chọn: đáp án mẫu chung, áp cho mọi đề của trạm
### BƯỚC: Hỏi bệnh                  ← đáp án mẫu chung cho bước Hỏi bệnh
<nội dung>
### BƯỚC: Xử trí – tư vấn
<nội dung>

## ĐỀ: <tên đề hiển thị>            ← bắt đầu một đề (bắt buộc); không trùng tên trong cùng trạm
Số: <số đề trong tài liệu, vd 2.5>  ← tùy chọn
Mã: <ma-tram--ma-de>                ← tùy chọn; bỏ trống thì tự tạo
Nguồn đề: <vd Y21 – đợt 1>          ← nên có; hiện ở danh sách đề
Tên: <tên ngắn>                     ← tùy chọn; bỏ dòng này thì lấy tên ở dòng "## ĐỀ:"
Dòng nguồn: <a-b>                   ← tùy chọn: số dòng trong nguon/TongHop_OSCE_Y21_TungBuoc.md

### Mở đầu                          ← bắt buộc: bối cảnh hiện ngay khi vào trạm
<nguyên văn>
Soạn thêm:                          ← tùy chọn: phần tự soạn thêm ở dưới dòng này
<phần soạn thêm>

### Tác vụ                          ← tùy chọn: yêu cầu của trạm
<nội dung>

### BƯỚC: Hỏi bệnh                  ← mỗi bước một khối, theo thứ tự làm
#### Đề                             ← bắt buộc (để trống = dùng "yêu cầu chung" của bước)
<yêu cầu của bước, hiện ngay khi mở bước>
#### Kết quả                        ← thông tin bệnh nhân mở ra SAU khi bấm "Hoàn thành bước"
<nguyên văn>
Soạn thêm:
<phần soạn thêm>
#### Hình                           ← tùy chọn: mỗi dòng một ảnh (đường dẫn hoặc ![](…)), hiện cùng Kết quả
nguon/hinh/p096-1.jpg
#### Đáp án                         ← tùy chọn: thay đáp án mẫu chung cho bước này; ghi (trống) để bỏ đáp án mẫu
<nội dung>
#### Đáp án riêng                   ← tùy chọn: đáp án / ghi chú riêng của đề cho bước này
<nội dung>

### BƯỚC: Chẩn đoán – nhận định
#### Đề

### Giải đáp                        ← tùy chọn: giải đáp / ghi chú của đề, hiện khi làm xong trạm
<nội dung>
```

Đề ví dụ điền đủ
----------------

Dưới đây là đề Rubella – Y21 đợt 1, chữ lấy đúng từ `nguon/TongHop_OSCE_Y21_TungBuoc.md` (dòng 537–549 và các bước tiếp cận 553–673); phần dưới dòng `Soạn thêm:` là tự soạn thêm. Có thể chép phần này thành một file riêng để thử trang **Nạp đề** (sẽ báo trùng vì đề này đã có sẵn – đổi `Mã` và tên đề để nạp thử).

# TRẠM: Rubella
Mã: rubella
Chương: CHƯƠNG 2: NỬA ĐẦU THAI KÌ
Tên gốc: TIẾP CẬN RUBELLA

## LÝ THUYẾT

#### 1. LÝ THUYẾT CẦN NHỚ

- IgM là một kháng thể xuất hiện 4-5 ngày và tồn tại 6 tuần sau khi bắt đầu có triệu chứng.
- Một điểm lưu ý là tái nhiễm rubella có thể làm tăng IgM thoáng qua.
- IgG huyết thanh xuất hiện 1-2 tuần sau khi bắt đầu có triệu chứng.

## ĐỀ: 2.5 Y21 – đợt 1
Số: 2.5
Mã: rubella--2-5
Nguồn đề: Y21 – đợt 1
Tên: 
Dòng nguồn: 538-550

### Mở đầu

- Thai phụ đến khám thai nhờ tư vấn kết quả Rubella: “Kết quả huyết thanh của tui như vầy thì có sao không bác sĩ?”. Tác vụ yêu cầu:

### Tác vụ

1. Hỏi bệnh sử, tiền sử liên quan đến vấn đề của bệnh nhân
2. Giải đáp thắc mắc của bệnh nhân
3. Đưa ra hướng quản lí

### BƯỚC: Hỏi bệnh

#### Đề

#### Kết quả

- Hỏi tiền sử: bà này chưa từng nhiễm Rubella, chưa từng chích vaccine cũng ko tiếp xúc với ai bị

Soạn thêm:
- Chị 28 tuổi, nhân viên văn phòng, PARA 0000, thai tự nhiên.
- Sáu tuần nay không sốt, không phát ban, không đau khớp; gia đình không ai bị Rubella.

#### Đáp án

##### 3.1 Có yếu tố dịch tễ Rubella? (trả lời 5 câu hỏi)

- Thai của mình bao nhiêu tuần rồi? Cho tôi xin sổ khám thai
- PARA (không cần)
- Phải khẳng định tuổi thai nếu đề không rõ (xem phần trễ kinh)
1. Gần đây (6 tuần nay) có bị sốt, phát ban hay đau khớp không? Triệu chứng xuất hiện từ khi nào?
2. Có từng nhiễm rubella chưa?
3. Có được chích ngừa rubella chưa? Có đem giấy chứng nhận tiêm không? Thời điểm chích?

- Chích bao nhiêu mũi?

4. Thai kì trước có được làm xét nghiệm rubella không? Kết quả? Thai kì trước có nhiễm không?

- Chứng nhận nhiễm?

5. Gia đình có ai từng bị rubella không? Gần đây có tiếp xúc với ai bị nhiễm rubella không?

#### Đáp án riêng

- Xác định tuổi thai (quan trọng để định hướng xử trí): xem sổ khám thai và khẳng định lại một lần nữa tuổi thai như vậy là chính xác chưa

### BƯỚC: Cận lâm sàng

#### Đề

#### Kết quả

Soạn thêm:
- Sổ khám thai: kinh chót tin cậy (kinh đều 28 ngày), siêu âm hôm nay CRL phù hợp tuổi thai 6 tuần.
- Rubella IgM (−), IgG (+) (lấy máu lúc thai 6 tuần).

### BƯỚC: Chẩn đoán – nhận định

#### Đề

#### Đáp án

##### 3.3 Xử lý tình huống/ Tư vấn

- **Lý giải kết quả-đề xuất giải pháp chẩn đoán:**

###### 3.3.1 TH1: IgM(-), IgG(-):

- Với kết quả xét nghiệm này, hiện tại tình trạng của **chị chưa có miễn dịch với rubella,** có **2 khả năng** xảy ra với chị:
    + **Khả năng 1:** Có thể hiện tại chị không có nhiễm Rubella, tuy nhiên vì chưa có kháng thể nên chị có khả năng sẽ bị nhiễm rubella trong thời gian sắp tới.
    + **Khả năng 2:** Tuy không có triệu chứng lâm sàng hay dịch tễ liên quan nhưng không loại trừ nguy cơ chị đã nhiễm mới Rubella gần đây nhưng do thời gian chưa đủ để có thể xét nghiệm ra kết quả dương tính.
- Do đó, cần theo dõi thai kỳ và **lặp lại bộ xét nghiệm này sau mỗi lần khám thai 4 tuần** đến khi **thai đủ 16 tuần.** Kể từ sau 16 tuần là thời gian **biến chứng lên thai nhi thấp** nếu thai bị nhiễm rubella, nên chị có thể **ngưng xét nghiệm và khám thai bình thường.**
- Vì chị chưa có miễn dịch với Rubella nên chị nên đeo khẩu trang, tránh tiếp xúc với người có triệu chứng sốt, ho, phát ban và nếu có triệu chứng như trên thì đến khám bác sĩ ngay.

###### 3.3.2 TH2: IgM (+), IgG (+)

- Với kết quả xét nghiệm này, có **3 khả năng** xảy ra với chị:
- **Khả năng 1:** Xét nghiệm **IgM dương giả,** có nghĩa là chị không bị nhiễm rubella nhưng kết quả
- IgM dương tính. IgG dương tính là do chị đã mắc rubella từ trước hoặc đã từng được chích vaccine.

- **Khả năng 2:** Tái nhiễm, trước đây chị bị nhiễm nhưng không biết, nay nhiễm lại
- Nếu rơi vào 2 khả năng này thì thai sẽ được quản lý như bình thường.

- **Khả năng 3:** Chị có thể bị nhiễm rubella cấp trong thai kì này, và ở thai mình đang ở tuần …, nên …
- (Nếu **6 < thai < 12 tuần:** nguy cơ thai bị **hội chứng Rubella bẩm sinh** rất cao, có thể phải cân nhắc đến khả năng chấm dứt thai kỳ. Bây giờ mình sẽ tiến hành chọc ối vào tuần 20 để chẩn đoán bé có nhiễm Rubella hay không và siêu âm hình thái học tầm soát các bất thường cấu trúc của CRS.
- Nếu **12 < thai < 16 tuần:** nguy cơ thai bị **hội chứng Rubella bẩm sinh** khoảng **45%,** Bây giờ mình sẽ tiến hành siêu âm 4D mỗi 2 tuần để sớm nhận diện các dấu hiệu của hội chứng Rubella bẩm sinh đồng thời chọc ối vào tuần 20 để chẩn đoán bé có mắc Rubella hay không và phải cân nhắc đến **khả năng phải chấm dứt thai kỳ.**
- Nếu **thai >=16 tuần:** nguy cơ thai bị hội chứng Rubella bẩm sinh là **thấp đến không bị,** và đứa bé sẽ được **theo dõi trên siêu âm hình thái học như thường quy.)**
- *Có thể bị âm tính giả nếu thời gian nhiễm đến lúc chọc ối < 6 tuần
- Trước tiên, để phân biệt chị rơi vào khả năng nào, thì tôi sẽ đề nghị **xét nghiệm lại IgM và IgG vào 2 tuần nữa, nếu IgG tăng gấp 4 lần** thì xác nhận **chị có nhiễm rubella cấp.** Còn nếu **không tăng cao quá 4 lần** thì xác nhận **IgM dương giả hoặc tái nhiễm,** thai sẽ được **quản lý bình thường.**

###### 3.3.3 TH3: IgM(+), IgG(-)

- Với kết quả xét nghiệm này, có **2 khả năng** xảy ra với chị:
- **Khả năng 1:** Xét nghiệm IgM dương giả, có nghĩa là chị không bị nhiễm rubella nhưng kết quả
- IgM dương tính.

- **Khả năng 2:** Chị bị nhiễm rubella cấp trong thai kì này, và ở thai mình đang ở tuần …, nên …
- Trước tiên, để phân biệt chị rơi vào khả năng nào, thì tôi sẽ đề nghị xét nghiệm lại **IgM và IgG** vào **2 tuần nữa,** nếu **IgG (-), IgM (+)** thì xác nhận chị rơi vào khả năng đầu, chị không bị nhiễm rubella cấp. Còn nếu **IgG (+)** thì chị **mắc rubella trong thai kì.**
- Khoảng thời gian IgM (+) rồi IgG (-) chuyển sang IgG(+) khoảng 1-2 tuần

###### 3.3.4 TH4: Igm (-), Igg (+)

- Với kết quả xét nghiệm này, có **2 khả năng** xảy ra với chị:

- **Khả năng 1:** chị **đã có miễn dịch trước đó.** Có thể chị đã được tiêm vaccin Rubella trước đó mà chị quên hoặc cũng có thể chị đã từng mắc Rubella trước đây nhưng chị không biết và nếu có nhiễm thì cũng đã trước lần có thai này. (25% số bệnh nhân nhiễm không triệu chứng. Và do chị đã có miễn dịch nên miễn dịch sẽ bảo vệ chị và con trong suốt thai kỳ nên là chị yên tâm nha, chị không cần phải lặp lại xét nghiệm huyết thanh ở thai kì này và cả thai kì sau do sự bảo vệ của kháng thể là dài hạn. Chị sẽ được khám thai thường quy, hiện tại chị đang ở … tuần, lần khám tiếp theo là … khi có ra huyết, đau bụng, có bất kỳ lo lắng nào khác ảnh hưởng đến mình thì chị đến khám liền.)
- **Khả năng 2:** Chị đã bị nhiễm rubella cấp trong thai kì này, thời điểm nhiễm đã hơn 6 tuần thì kết quả kháng thể Igm trở về âm tính (nếu thai kì =< 8 tuần thì không tư vấn khả năng này)
- Khả năng thứ hai xảy ra rất thấp vì chị không có triệu chứng và yếu tố nguy cơ nhiễm rubella trước đó 6 tuần, thường kết quả này chúng tôi sẽ nghĩ đến chị đã được miễn dịch trước đó.
- Vì vậy, chị sẽ được khám thai thường quy, chị sẽ được làm siêu âm hình thái học vào tuần thứ 20 đến 24 để khảo sát hình thái học thai nhi nếu phát hiện bất thường, sẽ cân nhắc chọc ối cho chị. TH chị có sốt ho, đau khớp phát ban vào trước đó 6 tuần nên có thể chị đã bị nhiễm rubella cấp vào thời điểm đó nhưng hiện tại đã >6 tuần nên có thể Igm đã âm tính.

#### Đáp án riêng

- IgM (-) IgG (+) ở tuổi thai 6 tuần → chắc chắn đã có miễn dịch với Rubella → kết luận khám thai tiêu chuẩn (khẳng định ko lặp lại xét nghiệm huyết thanh ở thai kì này và những thai kì sau thì sẽ điểm cao hơn)

### BƯỚC: Xử trí – tư vấn

#### Đề

#### Đáp án

##### 3.2 Kiến thức về rubella

- Chị có biết gì về rubella không?
1. Khái niệm rubella
- Rubella là một bệnh do virus Rubella gây ra, đây là bệnh truyền nhiễm lành tính và có thể tự khỏi.
2. Đường lây truyền
- Bệnh Rubella dễ dàng lây truyền qua đường hô hấp khi tiếp xúc với người bệnh Rubella đang ho, hắc hơi.
3. Lây nhiều vào thời điểm nào
- Nếu mình nhiễm mới Rubella trong thai kì, **thời điểm nhiễm virus càng sớm nguy cơ lây truyền cho con càng cao**
4. Triệu chứng mẹ
- Đối với mẹ thì triệu chứng chỉ là sốt, phát ban, đau khớp và có thể tự khỏi
5. Triệu chứng con
- Nhưng nếu lây truyền cho con thì sẽ gây ra hậu quả **nghiêm trọng như sẩy thai, thai lưu, thai giới hạn tăng trưởng, sanh non** và trẻ nếu được sinh ra cũng có các **dị tật bẩm sinh như đầu nhỏ, đục thuỷ tinh thể, câm điếc, dị tật tim**
- Chính vì thế khi đi khám thai, các bác sĩ thường chỉ định làm xét nghiệm Rubella để theo dõi và có hướng can thiệp kịp thời.

#### 4. CÁC TƯ VẤN BỔ SUNG

- **Tư vấn theo dõi sức khỏe**

- Vì kết quả Igg (-) nên xác nhận chị chưa chích vaccine và chưa bị nhiễm rubella trước đó, chị nên tiêm ngừa Rubella sau sinh.
- Chị nhớ ăn uống đẩy đủ, nghỉ ngơi nhiều, giảm vận động nặng.
- Trong thời gian tới, nếu có các triệu chứng như đau bụng, ra huyết, ra nước, sốt thì chị nhớ đi khám liền. Chị đừng quá lo lắng, chúng tôi sẽ cố gắng hết sức và đồng hành cùng chị trong mọi hoàn cảnh.
- Igm (-) Igg(+)
- TH1: Thai phụ đã có miễn dịch từ trước
- TH2: Thai phụ mới mắc trong thai kỳ này và đã qua 6 tuần Igm(+)

- Nếu thai phụ có giấy tiêm ngừa / giấy điều trị trước đó —> TH1
- Phân định trường hợp 1 và 2: không dùng biến thiên nồng độ để xác định nhiễm cấp hay muộn mà dùng Igg aividity.
- Nếu Igg avidity yếu —> TH2 + xem xét triệu chứng lâm sàng để ủng hộ
- Nếu Igg avidity mạnh —> TH1
- TH1: Thai phụ đã có miễn dịch bảo vệ từ trước, theo dõi thai kỳ thường quy.
- TH2:
- Thai =< 8 tuần: thời gian nhiễm không liên quan đến thai kỳ, theo dõi thai kỳ thường quy. **39 |**
- Thai > 8 tuần: trừ 6 tuần để ra tuần nghi ngờ nhiễm, tư vấn nguy cơ rubella bẩm sinh, theo dõi bất thường trên siêu âm hình thái học + test xâm lấn để chẩn đoán.

#### Đáp án riêng

- Tư vấn (NHỚ hỏi kiến thức Rubella trước tư vấn)

### Giải đáp

- Rubella
