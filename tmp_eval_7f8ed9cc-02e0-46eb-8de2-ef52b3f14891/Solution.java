
public class Solution {
    public String reverse(String s) {
    String rev = "";
    for(int i = s.length() - 1; i >= 0; i--) {
        rev += s.charAt(i);
    }
    return rev;
}

    public static void main(String[] args) {
        try {
            System.out.println(new Solution().reverse(""));
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
