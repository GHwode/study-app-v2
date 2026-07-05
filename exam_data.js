// ==================== 考试系统数据 ====================
// 按教材单元进度设计：月考、季考、期中、期末

const EXAM_DATA = {
  math: {
    7: {
      monthly_exams: [
        {
          exam_id: 'math7_m1',
          name: '七年级上册第一次月考',
          scope: '第1-2单元（有理数、整式的加减）',
          duration: 90,
          total_score: 120,
          time: '2024年9月',
          sections: [
            {
              type: '一、选择题（每题3分，共30分）',
              questions: [
                { type: 'choice', question: '下列各数中，负数是？', options: ['3', '0', '-5', '1/2'], answer: 2, score: 3 },
                { type: 'choice', question: '-3的相反数是？', options: ['-3', '3', '1/3', '-1/3'], answer: 1, score: 3 },
                { type: 'choice', question: '|-7|的值是？', options: ['-7', '7', '±7', '1/7'], answer: 1, score: 3 },
                { type: 'choice', question: '下列单项式中，系数为-2的是？', options: ['2x', '-2x²', '-2x³', 'x²-2'], answer: 2, score: 3 },
                { type: 'choice', question: '计算(-2)×(-3)的结果是？', options: ['-6', '6', '-5', '5'], answer: 1, score: 3 },
                { type: 'choice', question: '多项式x²+2x-1的次数是？', options: ['1', '2', '3', '4'], answer: 1, score: 3 },
                { type: 'choice', question: '(-1)²⁰²⁴=？', options: ['1', '-1', '2024', '-2024'], answer: 0, score: 3 },
                { type: 'choice', question: '下列运算正确的是？', options: ['a+a=2a²', '3x-2x=1', '2³=6', '(-2)³=-8'], answer: 3, score: 3 },
                { type: 'choice', question: '若a+b<0且ab>0，则？', options: ['a>0,b>0', 'a<0,b<0', 'a>0,b<0', 'a<0,b>0'], answer: 1, score: 3 },
                { type: 'choice', question: '3x²y与-5x²y是？', options: ['同类项', '不同类项', '单项式', '无法确定'], answer: 0, score: 3 }
              ]
            },
            {
              type: '二、填空题（每题3分，共18分）',
              questions: [
                { type: 'fill', question: '海拔高度-100米表示___', answer: '低于海平面100米', score: 3 },
                { type: 'fill', question: '-5的绝对值是___', answer: '5', score: 3 },
                { type: 'fill', question: '单项式-4x²y的系数是___，次数是___', answer: ['-4', '3'], score: 3 },
                { type: 'fill', question: '计算：(-8)+(+3)=___', answer: '-5', score: 3 },
                { type: 'fill', question: '计算：(-6)÷2=___', answer: '-3', score: 3 },
                { type: 'fill', question: '合并同类项：3x+2x=___', answer: '5x', score: 3 }
              ]
            },
            {
              type: '三、解答题（共72分）',
              questions: [
                { type: 'calc', question: '计算：(-12)-(+8)+(-6)-(-5)', answer: '-21', score: 10, explanation: '=-12-8-6+5=-21' },
                { type: 'calc', question: '计算：(-2)³×(-3)', answer: '24', score: 10, explanation: '=(-8)×(-3)=24' },
                { type: 'calc', question: '化简：3x²-2x+5-x²+4x-3', answer: '2x²+2x+2', score: 10, explanation: '=(3x²-x²)+(-2x+4x)+(5-3)=2x²+2x+2' },
                { type: 'solve', question: '已知a=-3，b=2，求a²-2ab+b²的值', answer: '25', score: 12, explanation: '=(-3)²-2×(-3)×2+2²=9+12+4=25' },
                { type: 'word', question: '某仓库原有货物500吨，上午运进120吨，下午运出80吨，晚上又运进60吨，现在仓库有多少吨货物？', answer: '600', score: 10, explanation: '500+120-80+60=600吨' },
                { type: 'proof', question: '证明：无论x取何值，x²+2x+1总是非负数', answer: '见解析', score: 10, explanation: 'x²+2x+1=(x+1)²≥0，完全平方数恒非负' },
                { type: 'comprehensive', question: '某班45名学生，男生人数比女生人数多5人，求男女生各多少人？（列方程解答）', answer: '男25人，女20人', score: 12, explanation: '设女生x人，则男生(x+5)人，x+(x+5)=45，解得x=20，男生=25人' }
              ]
            }
          ],
          difficulty: 'medium',
          passing_score: 72,
          excellent_score: 102
        }
      ],
      
      midterm_exam: {
        exam_id: 'math7_midterm',
        name: '七年级上册期中考试',
        scope: '第1-3单元（有理数、整式的加减、一元一次方程）',
        duration: 120,
        total_score: 120,
        time: '2024年11月',
        sections: [
          {
            type: '一、选择题（每题3分，共30分）',
            questions: [
              { type: 'choice', question: '下列各数中，是有理数的是？', options: ['π', '√2', '-3', '√3'], answer: 2, score: 3 },
              { type: 'choice', question: '|-8|的相反数是？', options: ['8', '-8', '1/8', '-1/8'], answer: 1, score: 3 },
              { type: 'choice', question: '计算(-2)²的结果是？', options: ['-4', '4', '-2', '2'], answer: 1, score: 3 },
              { type: 'choice', question: '单项式-3x²y的系数是？', options: ['3', '-3', '2', '3'], answer: 1, score: 3 },
              { type: 'choice', question: '合并同类项：5a-2a=？', options: ['3a', '3', '7a', '3a²'], answer: 0, score: 3 },
              { type: 'choice', question: '方程2x+3=7的解是？', options: ['1', '2', '3', '4'], answer: 1, score: 3 },
              { type: 'choice', question: '若x=3是方程ax-6=0的解，则a=？', options: ['1', '2', '3', '6'], answer: 1, score: 3 },
              { type: 'choice', question: '30°的余角是？', options: ['30°', '60°', '120°', '150°'], answer: 1, score: 3 },
              { type: 'choice', question: '下列图形中，不是立体图形的是？', options: ['球', '圆柱', '三角形', '圆锥'], answer: 2, score: 3 },
              { type: 'choice', question: '一个数的2倍减去5等于11，这个数是？', options: ['3', '5', '8', '16'], answer: 1, score: 3 }
            ]
          },
          {
            type: '二、填空题（每题3分，共18分）',
            questions: [
              { type: 'fill', question: '-7的绝对值是___', answer: '7', score: 3 },
              { type: 'fill', question: '2x²与-5x²是___项', answer: '同类', score: 3 },
              { type: 'fill', question: '方程3x=15的解是x=___', answer: '5', score: 3 },
              { type: 'fill', question: '75°的补角是___度', answer: '105', score: 3 },
              { type: 'fill', question: '棱柱有___个顶点，___条棱，___个面（以六棱柱为例）', answer: ['12', '18', '8'], score: 3 },
              { type: 'fill', question: '若a+b=5，ab=3，则(a+b)²-2ab=___', answer: '19', score: 3 }
            ]
          },
          {
            type: '三、解答题（共72分）',
            questions: [
              { type: 'calc', question: '计算：(-15)+(+8)-(-6)-(+10)', answer: '-11', score: 8, explanation: '=-15+8+6-10=-11' },
              { type: 'calc', question: '计算：(-3)²+(-2)×(-5)', answer: '19', score: 8, explanation: '=9+10=19' },
              { type: 'calc', question: '化简：2(x²-2x+1)-3(x²-x)', answer: '-x²-x+2', score: 10, explanation: '=2x²-4x+2-3x²+3x=-x²-x+2' },
              { type: 'solve', question: '解方程：4x-7=2x+5', answer: 'x=6', score: 10, explanation: '4x-2x=5+7，2x=12，x=6' },
              { type: 'solve', question: '解方程：(x+1)/2=3', answer: 'x=5', score: 10, explanation: 'x+1=6，x=5' },
              { type: 'word', question: '某商店进一批商品，按进价增加20%出售，因积压降价20%以每件2880元售出，求每件商品的盈亏', answer: '亏120元', score: 12, explanation: '设进价x元，x(1+20%)(1-20%)=2880，0.96x=2880，x=3000，售价2880<进价3000，亏120元' },
              { type: 'comprehensive', question: '如图，已知∠AOB=90°，OC平分∠AOB，OD平分∠BOC，求∠AOD的度数', answer: '67.5°', score: 14, explanation: '∠BOC=45°，∠BOD=22.5°，∠AOD=90°-22.5°=67.5°' }
            ]
          }
        ],
        difficulty: 'hard',
        passing_score: 72,
        excellent_score: 102
      }
    }
  }
};
