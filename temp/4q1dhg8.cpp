#include<bits/stdc++.h>

using namespace std;
 
#define int long long 
#define pb push_back
#define FAST   ios::sync_with_stdio(false); cin.tie(0); cout.tie(0);
#define TIC     int tt = (int) clock();
#define TOK   cerr << "TIME = " << (double)(clock() - tt) / CLOCKS_PER_SEC << endl;

#define print(a) for(auto i : a) cout<<i<<" "; cout<<endl;;

int kiran_bhanushali[29][7][20];

void init(){
    for(int i=0;i<29;i++){
        kiran_bhanushali[i][0][0] = rand()%1000;
    }
}


void solve(){
    // code here
    int n ;
    cin>>n;
    cout<<n;
}

int32_t main(){
  
    //=================================================
    FAST
    init();
    //=================================================

        int t=1;
        //cin>>t;
    while(t--){
        solve();
        }
    return 0;
}
