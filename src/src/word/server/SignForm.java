package word.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import word.server.SQL;

/**
 * Servlet implementation class HelloForm
 */
@WebServlet("/sign")
public class SignForm extends HttpServlet {
    private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SignForm() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    		request.setCharacterEncoding("utf-8");
    		Map<String, String[]> NameList = request.getParameterMap();
    		Set<String> NameKey = NameList.keySet();
    		for (String key : NameKey) {
    			System.out.print(key + ": ");
    			String[] valueList = NameList.get(key);
    			for (String value: valueList) {
    				System.out.println(value);
    			}
    		}
    		
    		String value = new String(request.getParameter("value"));
    		String types = new String(request.getParameter("nametype"));
    		String USER = new String(request.getParameter("mysql_user"));
    		String PASS = new String(request.getParameter("mysql_pass"));
    		String DB_URL = new String(request.getParameter("mysql_url"));
    		
    		try {
    			int count = 0;
    			if (types.equals("email")) {
        			count = SQL.select_count(USER, PASS, DB_URL, 1, new String[]{value});
        		} else if (types.equals("name")) {
        			count = SQL.select_count(USER, PASS, DB_URL, 0, new String[]{value});
        		}
    			response.setContentType("application/json;charset=utf-8");
    			response.setStatus(200);
    			PrintWriter out = response.getWriter();
    			
    			String JsonStr = "{\"Duplicate\" : " + count + "}";
    			out.write(JsonStr);
    			out.close();
    			
    		} catch (Exception e) {
    			e.printStackTrace();
    			response.setStatus(403);
    		}
    		
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    		request.setCharacterEncoding("utf-8");
        String name =new String(request.getParameter("name"));
        String password = new String(request.getParameter("password"));
        String email = new String(request.getParameter("email"));
        String portrait = new String(request.getParameter("portrait"));
        String USER = new String(request.getParameter("mysql_user"));
		String PASS = new String(request.getParameter("mysql_pass"));
		String DB_URL = new String(request.getParameter("mysql_url"));
        
        String cet4 = new String(request.getParameter("cet4"));
        if (cet4.equals("-1")) cet4 = "0";
        String cet6 = new String(request.getParameter("cet6"));
        if (cet6.equals("-1")) cet6 = "0";
        String toefl = new String(request.getParameter("toefl"));
        if (toefl.equals("-1")) toefl = "0";
        String day = new String(request.getParameter("day"));
        
        System.out.println("new user: \nname: "+ name + "\nemail:" + email + "\npassword: "+ password);
        System.out.println("recite: cet4:" + cet4 + " cet6:" + cet6 + " toefl:" + toefl + " day:" + day);
        
        response.setContentType("text/html;charset=UTF-8");
        try {
        	   SQL.insert(USER, PASS, DB_URL, 0, new String[]{name, email, password, portrait, cet4, cet6, toefl, day});
        	   SQL.create_own_word_book(USER, PASS, DB_URL, cet4, cet6, toefl, name);
        } catch (SQLException e1){
        		response.setStatus(403);
        		e1.printStackTrace();
        } catch (ClassNotFoundException e2) {
			e2.printStackTrace();
			response.setStatus(400);
		} 
        response.setStatus(200);
        
    }
}