const { exec } = require('child_process');

const searchFiles = (req, res) => {
    const { query,drive } = req.body;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    console.log(`Searching Windows Index for: ${query}`);

    // Escape single quotes for PowerShell
    const safeQuery = query.replace(/'/g, "''");

    // Add a drive filter if a specific drive is requested
    let driveFilter = '';
    if (drive) {
        const safeDrive = drive.replace(/'/g, "''");
        driveFilter = ` AND System.ItemPathDisplay LIKE ''${safeDrive}%''`;
    }

    const psCommand = `
        $con = New-Object -ComObject ADODB.Connection;
        $con.Open('Provider=Search.CollatorDSO;Extended Properties=''Application=Windows'';');
        $rs = $con.Execute('SELECT TOP 50 System.ItemPathDisplay FROM SystemIndex WHERE System.FileName LIKE ''%${safeQuery}%''${driveFilter}');
        $results = @();
        while (-not $rs.EOF) {
            $results += $rs.Fields.Item('System.ItemPathDisplay').Value;
            $rs.MoveNext();
        }
        $con.Close();
        $results | ConvertTo-Json -Compress;
    `.replace(/\n/g, ' ').replace(/\r/g, '');

    exec(`powershell -NoProfile -Command "${psCommand}"`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error("Search Execution Error:", error);
            return res.status(500).json({ message: "Failed to search files.", error: stderr || error.message });
        }

        try {
            const out = stdout.trim();
            if (!out) {
                 return res.status(200).json({ files: [] });
            }
            
            // ConvertTo-Json returns a single string if there's 1 result, or array if multiple.
            let parsed = JSON.parse(out);
            if (!Array.isArray(parsed)) {
                parsed = [parsed];
            }

            return res.status(200).json({ files: parsed });
        } catch (e) {
            console.error("JSON parse error:", e, "Stdout:", stdout);
            return res.status(500).json({ message: "Failed to parse search results" });
        }
    });
};

module.exports = { searchFiles };
