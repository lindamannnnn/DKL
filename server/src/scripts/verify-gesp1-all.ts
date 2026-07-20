const BASE = 'http://localhost:4001'
const LOGIN = { email: 'student@dkl.local', password: 'student123', tenantId: '080ffa34-df87-4566-b1ef-555b88bfe5b8' }

const solutions: Record<string, string> = {
  // 课程01
  '764eaf4b-bbaa-4600-8f02-5a87f3fe021f': `#include <iostream>\nusing namespace std;\nint main(){ int a,b; cin>>a>>b; cout<<a<<"*"<<b<<"="<<a*b<<endl; return 0; }`,
  'e31fe35b-35e4-4a8c-a82b-16a388aa2ae6': `#include <iostream>\nusing namespace std;\nint main(){ int l,w; cin>>l>>w; cout<<2*(l+w)<<endl<<l*w<<endl; return 0; }`,
  '4eced21c-7fb9-4a11-bd25-cef5ac98cff6': `#include <iostream>\nusing namespace std;\nint main(){ int x,y; cin>>x>>y; cout<<5*y/x<<endl; return 0; }`,
  '1bcf4e71-f8e9-4374-a8ae-bc0be0eb891d': `#include <iostream>\nusing namespace std;\nint main(){ int x,y,n; cin>>x>>y>>n; cout<<n-(x+y)<<endl; return 0; }`,
  '776aa0fc-c01a-442c-af23-8dff08255dd1': `#include <iostream>\nusing namespace std;\nint main(){ int m,n; cin>>m>>n; cout<<m/n<<" "<<m%n<<endl; return 0; }`,
  // 课程02
  'dac7ace2-c17f-4876-8886-b13b0f8367f5': `#include <iostream>\nusing namespace std;\nint main(){ int a,b; cin>>a>>b; cout<<a/b<<" "<<a%b<<endl; return 0; }`,
  '657c8676-4f79-4333-96c7-fbbed07adfa6': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<n*24<<endl<<n*24*60<<endl; return 0; }`,
  'd45058d5-2831-416c-b407-cfec429000b8': `#include <iostream>\nusing namespace std;\nint main(){ int n,a,x; cin>>n>>a>>x; cout<<n-a*x<<endl; return 0; }`,
  '2ceadcf5-23c6-481d-a78c-b0b2f02adb59': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int rev=0,tmp=n; while(tmp){ rev=rev*10+tmp%10; tmp/=10; } cout<<rev<<endl; return 0; }`,
  '2c391259-3121-4622-b782-0df9408add07': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int a=n/1000,b=n/100%10,c=n/10%10,d=n%10; a=(a+5)%10; b=(b+5)%10; c=(c+5)%10; d=(d+5)%10; cout<<d<<c<<b<<a<<endl; return 0; }`,
  // 课程03
  '8d860f4a-cfc4-472d-b0b2-5b4e58dd5a21': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int x,y; cin>>x>>y; double cost=(x-1)*2.5+y*1.5; cout<<fixed<<setprecision(1)<<cost<<endl; return 0; }`,
  '9fc55865-c085-46a9-ac51-d285343f6f3c': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ double c; cin>>c; double f=9.0/5*c+32; cout<<fixed<<setprecision(2)<<f<<endl; return 0; }`,
  '5451e10c-fc09-41c7-a2a3-fc8d634e79d7': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int n; cin>>n; double s=(n/4.0)*(n/4.0); cout<<fixed<<setprecision(2)<<s<<endl; return 0; }`,
  '1ed7f477-3659-4df2-a085-f58358c91ab6': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int x,y,n; cin>>x>>y>>n; double cost=(x+y)*0.9; cout<<fixed<<setprecision(1)<<n-cost<<endl; return 0; }`,
  '71af74d8-7ab7-4237-b9b8-7094da5feda8': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ double r,h; cin>>r>>h; const double PI=3.14; double c1=2*PI*r,sa=PI*r*r,sb=4*PI*r*r,va=4.0/3*PI*r*r*r,vb=sa*h; cout<<fixed<<setprecision(2)<<"C1="<<c1<<"\\nSa="<<sa<<"\\nSb="<<sb<<"\\nVa="<<va<<"\\nVb="<<vb<<endl; return 0; }`,
  // 课程05
  '96d42f70-1de0-47ec-bf37-069a251a66e2': `#include <iostream>\nusing namespace std;\nint main(){ int a,b; cin>>a>>b; cout<<(a>b?a:b)<<endl; return 0; }`,
  '8c0c8cf9-1500-4546-8aed-dc383d28c6f1': `#include <iostream>\nusing namespace std;\nint main(){ int t; cin>>t; if(t>=20 && t<=30) cout<<"OK"; else cout<<"NO"; return 0; }`,
  'b5e20a44-3773-40f8-814a-304d8c08f948': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int rev=0,tmp=n; while(tmp){ rev=rev*10+tmp%10; tmp/=10; } int big=n>rev?n:rev,small=n>rev?rev:n; cout<<big<<"-"<<small<<"="<<big-small<<endl; return 0; }`,
  'fd09d949-3869-490a-afda-f647d41c6e73': `#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main(){ long long a,b,c; cin>>a>>b>>c; long long arr[3]={a,b,c}; sort(arr,arr+3); long long x=arr[0],y=arr[1],z=arr[2]; if(x+y<=z){ cout<<"no"<<endl; return 0; } long long lhs=x*x+y*y; long long rhs=z*z; if(lhs==rhs) cout<<"zhijiao"<<endl; else if(lhs>rhs) cout<<"ruijiao"<<endl; else cout<<"dunjiao"<<endl; return 0; }`,
  'a037684e-3e61-45bc-b5ad-2d4da1814c45': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; if(n/100==n%10) cout<<"Y"<<endl; else cout<<"N"<<endl; return 0; }`,
  // 课程06
  '2befbf8a-41dc-49e6-a05b-a4d440899e51': `#include <iostream>\nusing namespace std;\nint main(){ int a,b,c; cin>>a>>b>>c; cout<<(a+b>c?"yes":"no")<<endl; return 0; }`,
  '3a9bf901-5ea8-4d09-a883-f287c96d698e': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int n; cin>>n; double cost=n>10?n*2*0.9:n*2; cout<<fixed<<setprecision(1)<<cost<<endl; return 0; }`,
  '42de8ae8-1de0-4918-baea-3a4160afb117': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<(n%3==0 && n%5!=0?"Yes":"No")<<endl; return 0; }`,
  '41f3fdc1-0f33-4e70-a9cf-cfc1672a130b': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int rev=n%10*10+n/10; cout<<(n>rev?n:rev)<<endl; return 0; }`,
  '4551d609-0b74-4658-965d-f72e307d5a8b': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<(n%10==0?n*8/10:n)<<endl; return 0; }`,
  // 课程07
  '4bea5408-c110-41f1-8fde-59024c5d6a7d': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; if(n>=90) cout<<"yes"; return 0; }`,
  '2b6a4c4e-5776-4a5f-9758-36b9791592a9': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; if(n==1) cout<<"swim"<<endl; else if(n==3) cout<<"program"<<endl; else if(n==5) cout<<"read"<<endl; else if(n==6) cout<<"math"<<endl; else cout<<"rest"<<endl; return 0; }`,
  '8c2c907c-5027-45e7-91a0-2cecc22e5a6d': `#include <iostream>\nusing namespace std;\nint main(){ int s; cin>>s; if(s>=86) cout<<"VERY GOOD"<<endl; else if(s>=60) cout<<"GOOD"<<endl; else cout<<"BAD"<<endl; return 0; }`,
  '608c6dda-129a-41c2-95f3-7ca8f940110f': `#include <iostream>\nusing namespace std;\nint main(){ int s; cin>>s; if(s>=90) cout<<"Excellent"<<endl; else if(s>=80) cout<<"Good"<<endl; else if(s>=60) cout<<"Pass"<<endl; else cout<<"Fail"<<endl; return 0; }`,
  '3836270a-8c53-42dc-a426-6ddf1e555613': `#include <iostream>\nusing namespace std;\nint main(){ int y,m; cin>>y>>m; if(m==2){ bool leap=(y%4==0 && y%100!=0)||(y%400==0); cout<<(leap?29:28)<<endl; } else if(m==4||m==6||m==9||m==11) cout<<30<<endl; else cout<<31<<endl; return 0; }`,
  // 课程09
  '7f6be558-f0ff-4aed-90bd-a0d9434e5d73': `#include <iostream>\nusing namespace std;\nint main(){ char ch; cin>>ch; cout<<(int)ch<<endl; return 0; }`,
  '98fd9b72-e975-4fb4-8a57-25a07ea300e2': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<(char)n<<endl; return 0; }`,
  '4b9758f5-f018-4e65-b028-31b12561fad2': `#include <iostream>\nusing namespace std;\nint main(){ char ch; cin>>ch; if(ch>='A'&&ch<='Z') cout<<"upper"<<endl; else if(ch>='a'&&ch<='z') cout<<"lower"<<endl; else if(ch>='0'&&ch<='9') cout<<"digit"<<endl; return 0; }`,
  '09eed972-5334-48c5-b137-1ee33b45c0bc': `#include <iostream>\nusing namespace std;\nint main(){ char ch; cin>>ch; if(ch>='A'&&ch<='Z') ch=ch+32; else if(ch>='a'&&ch<='z') ch=ch-32; cout<<ch<<endl; return 0; }`,
  '3be93c78-6fbf-4af5-bc7f-76daa78e811a': `#include <iostream>\nusing namespace std;\nint main(){ char ch; cin>>ch; if(ch=='z') cout<<'a'<<endl; else if(ch=='Z') cout<<'A'<<endl; else cout<<(char)(ch+1)<<endl; return 0; }`,
  // 课程10
  '6bad4c81-19e5-4faf-99c1-5bde52d48c2d': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; for(int i=1;i<=n;i++) cout<<i<<endl; return 0; }`,
  'f05395ad-7506-4906-96a8-01dc333433ee': `#include <iostream>\nusing namespace std;\nint main(){ for(int i=1;i<=100;i++) cout<<i<<endl; return 0; }`,
  '09b06146-35d4-4055-b55a-4a17e3ce71fc': `#include <iostream>\nusing namespace std;\nint main(){ for(int i=10;i<=1000;i++) if(i%2==0 && i%3==0 && i%7==0) cout<<i<<endl; return 0; }`,
  '548e02e4-14ae-498a-8eb6-dea787f144c1': `#include <iostream>\nusing namespace std;\nint main(){ int m,n,count=0; cin>>m>>n; for(int i=m;i<=n;i++){ if(i/100==i%10){ cout<<i<<endl; count++; } } cout<<count<<endl; return 0; }`,
  'f6620ea1-8054-4dea-91e8-08de5504e0ba': `#include <iostream>\nusing namespace std;\nint main(){ int n,sum=0; cin>>n; for(int i=1;i<=n;i+=2) sum+=i; cout<<sum<<endl; return 0; }`,
  // 课程11
  'cd3f3eaf-d41b-41d4-836b-720d10ae063b': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int d=-1; for(int i=2;i*i<=n;i++) if(n%i==0){ d=i; break; } if(d==-1) cout<<"Yes"<<endl; else cout<<d<<endl; return 0; }`,
  'fc30ac8b-e451-4c8e-b753-40e5f298d7fd': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; for(int i=1;i<=n;i++){ if(i%2!=0) continue; if(i%3==0) continue; cout<<i<<endl; } return 0; }`,
  'a8bd55d1-bdbf-4a28-908e-d152d1265b12': `#include <iostream>\nusing namespace std;\nint main(){ double h=100; int cnt=0; while(h>=0.5){ cnt++; h/=2; } cout<<cnt<<endl; return 0; }`,
  'b7cc5f35-8c66-4e4b-8c23-f7a84d906e40': `#include <iostream>\nusing namespace std;\nint main(){ int n,count=0; cin>>n; for(int i=1;i<=n;i++) if(i%3==2 && i%5==3 && i%7==2) count++; cout<<count<<endl; return 0; }`,
  'c6dff5e6-0dbc-43d6-b170-e0db1c89674a': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; long long sum=0; for(int i=1;i<=n;i++){ int c=0; if(i%2==0)c++; if(i%3==0)c++; if(i%5==0)c++; if(i%7==0)c++; if(c>=2) sum+=i; } cout<<sum<<endl; return 0; }`,
  // 课程13
  'dfe43852-b264-4236-b66b-4d9a7d89bd9a': `#include <iostream>\nusing namespace std;\nint main(){ long long n,sum=0; cin>>n; for(long long i=1;i<=n;i++) sum+=i*i; cout<<sum<<endl; return 0; }`,
  '50c730e1-941d-4168-8e09-cd9d8b9ba21b': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; long long sum=0; for(int i=1;i<=n;i++){ if(i%7==0) continue; int t=i; bool ok=true; while(t){ if(t%10==7){ ok=false; break; } t/=10; } if(ok) sum+=i; } cout<<sum<<endl; return 0; }`,
  '117034e6-6390-463f-92af-bf87ff7f9fce': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; long long cnt=0,sum=0; for(int i=1;i<=n;i++) if(i%2==0 && i%3!=0){ cnt++; sum+=i; } cout<<cnt<<endl<<sum<<endl; return 0; }`,
  'd9115ae8-c169-4a54-b821-6e9688fbb3dc': `#include <iostream>\nusing namespace std;\nint main(){ int m,n,cnt=0; cin>>m>>n; for(int i=m;i<=n;i++) if(i%6==0 || i%8==0) cnt++; cout<<cnt<<endl; return 0; }`,
  'accda0a9-3b78-457d-9350-8d9610be7c5d': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int maxArea=0; for(int l=1;l<n/2;l++){ int w=n/2-l; int area=l*w; if(area>maxArea) maxArea=area; } cout<<maxArea<<endl; return 0; }`,
  // 课程14
  'e4fcb451-d675-475a-968f-a2c4dc7dd14b': `#include <iostream>\nusing namespace std;\nint main(){ int a,b; while(cin>>a>>b) cout<<a+b<<endl; return 0; }`,
  'c55f917b-3edd-42dc-9e93-a3e779a0becd': `#include <iostream>\nusing namespace std;\nint main(){ long long m,n; cin>>m>>n; long long a=m,b=n; while(b){ long long t=a%b; a=b; b=t; } long long g=a; cout<<(m/g)*n<<endl; return 0; }`,
  '32d739a1-8740-414a-b6e8-08c78fc885cf': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; long long cnt=0,sum=0; for(int i=1;i<=n;i++) if(i%2==1 || i%3==1 || i%5==1){ cnt++; sum+=i; } cout<<cnt<<endl<<sum<<endl; return 0; }`,
  '33565252-696e-4759-a916-7f737d2da95e': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int n; cin>>n; double sum=0; int sign=1; for(int i=1;i<=n;i++){ sum += sign*1.0/i; sign=-sign; } cout<<fixed<<setprecision(4)<<sum<<endl; return 0; }`,
  'b6362f2f-29ac-43b2-a736-bc05b96ee6fd': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; long long sum=0; if(n%2==1){ for(int i=2;i<=n;i+=2) sum+=i; } else { for(int i=1;i<=n;i++) if(n%i==0) sum+=i; } cout<<sum<<endl; return 0; }`,
  // 课程15
  'c82c7efe-67e9-4e45-9536-61ce6be823fb': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<n/10+n%10<<endl; return 0; }`,
  'b028b989-69cf-4b38-87c1-2c409d94733c': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; cout<<n/100+n/10%10+n%10<<endl; return 0; }`,
  'a5224d22-ae72-4f3b-abbe-33c2474f644e': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int s=0; while(n){ s+=n%10; n/=10; } cout<<s<<endl; return 0; }`,
  'f1ad558b-0ad0-45fa-b2c9-ec0280ecd2a1': `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; int a=n/1000,b=n/100%10,c=n/10%10,d=n%10; cout<<b<<a<<d<<c<<endl; return 0; }`,
  '73d4aadb-0776-4463-b80b-cd1b01e4c90f': `#include <iostream>\nusing namespace std;\nint main(){ int k; cin>>k; bool found=false; for(int n=10000;n<=30000;n++){ int a=n/10000,b=n/1000%10,c=n/100%10,d=n/10%10,e=n%10; int sub1=a*100+b*10+c; int sub2=b*100+c*10+d; int sub3=c*100+d*10+e; if(sub1%k==0 && sub2%k==0 && sub3%k==0){ cout<<n<<endl; found=true; } } if(!found) cout<<"No"<<endl; return 0; }`,
  // 课程17
  '023a0e80-06bc-4fa1-9abc-3071c82649ec': `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main(){ int a,b,h; cin>>a>>b>>h; double s=(a+b)*h/2.0; cout<<fixed<<setprecision(1)<<s<<endl; return 0; }`,
  '96829f71-4270-45fb-9a97-5b1281f51b3a': `#include <cstdio>\nint main(){ int n; scanf("%d",&n); int h=n/3600; int m=n%3600/60; int s=n%60; printf("%02d:%02d:%02d\\n",h,m,s); return 0; }`,
  'af1e24c5-bc7a-413a-aede-4c9d34243829': `#include <cstdio>\nint main(){ int n; scanf("%d",&n); double cost; if(n<=150) cost=n*0.4463; else if(n<=400) cost=150*0.4463+(n-150)*0.4663; else cost=150*0.4463+250*0.4663+(n-400)*0.5663; printf("%.1f\\n",cost); return 0; }`,
  '43de5c3b-bae0-45c5-ac99-08fbae3624dc': `#include <cstdio>\nint main(){ int x1,x2,x3,x4,x5,x6,x7; scanf("%d%d%d%d%d%d%d",&x1,&x2,&x3,&x4,&x5,&x6,&x7); int max=x1,min=x1; double sum=x1; if(x2>max) max=x2; if(x2<min) min=x2; sum+=x2; if(x3>max) max=x3; if(x3<min) min=x3; sum+=x3; if(x4>max) max=x4; if(x4<min) min=x4; sum+=x4; if(x5>max) max=x5; if(x5<min) min=x5; sum+=x5; if(x6>max) max=x6; if(x6<min) min=x6; sum+=x6; if(x7>max) max=x7; if(x7<min) min=x7; sum+=x7; printf("%.1f %d %d\\n",sum/7.0,max,min); return 0; }`,
  'a07ce5b5-81fd-45e6-aca6-085f3be0973c': `#include <cstdio>\nint main(){ int n; scanf("%d",&n); int d2=n/100, d3=n%100; double avg=(n+d2+d3)/3.0; printf("%.2f\\n",avg); return 0; }`,
}

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(LOGIN),
  })
  if (!res.ok) throw new Error('登录失败: ' + await res.text())
  return ((await res.json()) as any).token as string
}

async function getCourse(token: string) {
  const res = await fetch(`${BASE}/api/courses`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('获取课程失败: ' + await res.text())
  const courses = (await res.json()) as any[]
  return courses.find(c => c.title?.includes('GESP 1级'))
}

async function getLessons(token: string, courseId: string) {
  const res = await fetch(`${BASE}/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('获取课时失败: ' + await res.text())
  const body = await res.json() as any
  return body.chapters.flatMap((ch: any) => ch.lessons as any[]).sort((a: any, b: any) => a.sortOrder - b.sortOrder)
}

async function getProblems(token: string, lessonId: string) {
  const res = await fetch(`${BASE}/api/lessons/${lessonId}/problems`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('获取题目失败: ' + await res.text())
  return (await res.json()) as any[]
}

async function submit(token: string, problemId: string, lessonId: string, code: string) {
  const res = await fetch(`${BASE}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ problemId, code, language: 'cpp', lessonId }),
  })
  if (res.status === 429) {
    console.log('  触发限流，等待 15s 后重试...')
    await new Promise(r => setTimeout(r, 15000))
    return submit(token, problemId, lessonId, code)
  }
  if (!res.ok) throw new Error('提交失败: ' + await res.text())
  return (await res.json()) as any
}

async function main() {
  const token = await login()
  const course = await getCourse(token)
  const lessons = await getLessons(token, course.id)
  const summary: { lesson: string; problem: string; result: string; passed: number; total: number }[] = []

  for (const lesson of lessons) {
    const problems = await getProblems(token, lesson.id)
    console.log(`\n--- ${lesson.title} ---`)
    for (const p of problems) {
      const code = solutions[p.id]
      if (!code) {
        console.log(`[SKIP] ${p.title} (${p.id}) 无预设代码`)
        continue
      }
      const r = await submit(token, p.id, lesson.id, code)
      await new Promise(res => setTimeout(res, 1000))
      const result = r.submission?.result ?? 'unknown'
      const passed = r.submission?.passedCount ?? 0
      const total = r.submission?.totalCount ?? 0
      console.log(`[${result}] ${p.title} (${passed}/${total})`)
      if (result !== 'accepted') {
        console.log('  详情:', r.submission?.details?.map((d: any) => `${d.status}: in=${JSON.stringify(d.input)} exp=${JSON.stringify(d.expectedOutput)} got=${JSON.stringify(d.actualOutput)}`).join('\n  '))
      }
      summary.push({ lesson: lesson.title, problem: p.title, result, passed, total })
    }
  }

  const accepted = summary.filter(s => s.result === 'accepted').length
  console.log(`\n====================\n通过 ${accepted}/${summary.length}`)
  if (accepted < summary.length) {
    console.log('未通过题目:')
    summary.filter(s => s.result !== 'accepted').forEach(s => console.log(`  ${s.lesson} / ${s.problem}: ${s.result} ${s.passed}/${s.total}`))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
