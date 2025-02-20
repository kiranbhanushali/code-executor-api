#include<bits/stdc++.h>
using namespace std;
int check_file_equal(string &file1,string &file2){
    int flag= 1;
    ifstream f1,f2;
    char c1,c2;
    f1.open(file1,ios::in);
    f2.open(file2,ios::in);
    while(1){
        c1=f1.get();
        c2=f2.get();
        if( c1=='\n' && c2==EOF){
            break;
        }
        if( c2=='\n' && c1==EOF){
            break;
        }

        if(c1!=c2){
            flag=0;
            break;
        }
        if((c1==EOF)||(c2==EOF))
            break;
    }
    f1.close();
    f2.close();
    return flag;
}
int get_test_case_count(string &fname){
    ifstream f;
    f.open(fname,ios::in);
    int ret = 0 ; 
    char c ;
    while(( c=f.get())!=EOF ){
        if( c!='\n')
        ret = ret*10 + ( c-'0');
    }
    return ret;
}


int main(int argv,char *argc[]){
    // ./a.out MUL2 fqaaflasjkl.py

    string problem_code =argc[1];
    string filename = argc[2];

    

    int testcase = get_test_case_count(problem_code); 
    cout<<"Total testcases: "<<testcase<<endl;
    /* cout<<"Problem code: "<<problem_code<<endl; */
    /* cout<<"Testcase"<<testcase<<endl; */
    /* cout<<"Filename"<<filename<<endl; */
    auto py = [&] (){
        int correct = 0 ; 
        for( int i = 0 ; i<testcase;i++) {
            string s = "python "+ filename + " < in/" + problem_code + "_" + to_string(i+1) ;
            string tmpfile = filename+"myout"+to_string(i+1);
            s+= " > " + tmpfile;
            system(s.c_str());
            string rm_command = "rm "+ tmpfile;
            string outfile = "out/"+problem_code+"_"+to_string(i+1);
            correct+=  check_file_equal(outfile,tmpfile);
            system(rm_command.c_str());

        }
        return correct;
    };
auto compile_cpp = [&](){
        string s = "g++ -o "+filename+".out  "+ filename;
        system(s.c_str());
    };

    auto compile_c = [&](){
        string s = "gcc -o "+filename+".out  "+ filename;
        system(s.c_str());
    };
    auto run_c = [&](){
         int correct = 0 ; 
        for( int i = 0 ; i<testcase;i++) {
            string s = "./"+ filename+".out  < in/" + problem_code + "_" + to_string(i+1) ;
            string tmpfile = filename+"myout"+to_string(i+1);
            s+= " > " + tmpfile;
            system(s.c_str());
            string rm_command = "rm "+ tmpfile;
            string outfile = "out/"+problem_code+"_"+to_string(i+1);
            correct+=  check_file_equal(outfile,tmpfile);
            system(rm_command.c_str());

        }
        return correct;
    };
    /* cout<<"filenam"<<filename<<endl; */
    /* cout<<filename.back()<<endl; */
    switch ( filename.back() ){
        case 'y': 
            cout<<"Correct:"<<py()<<endl;;
            break;
        case 'c':
            compile_c();
             cout<<"Correct:"<<run_c()<<endl; 
            break;
        case 'p':
            compile_cpp();
             cout<<"Correct:"<<run_c()<<endl; 
            break;
        default:
            break;
    }

}
