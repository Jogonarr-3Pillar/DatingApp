namespace API.DTOs
{
    public class PhotoForApproval
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Username { get; set; }
        public bool IsApproved { get; set; }
    }
}